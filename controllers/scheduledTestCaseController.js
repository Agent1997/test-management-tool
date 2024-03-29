const lodash = require('lodash');
const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const ScheduledTestSuitesModel = require('./../models/scheduledTestSuitesModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const remove__v = require('../utils/remove__v');

const immutable = [
  'scheduledBy',
  'scheduledTestSuiteID',
  'testSuiteID',
  'rootTestCaseID'
];

const acceptedGetParams = ['scheduledTestSuiteID'];
// GOOD
exports.updateScheduledTestCase = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return next(new AppError(`Request Body is empty`, 400));
  }
  const params = Object.keys(req.body);
  let message = 'null';
  params.forEach(key => {
    if (immutable.includes(key)) {
      message += ` ${key} is not modifiable.`;
      delete req.body[key];
    }
  });
  const query = ScheduledTestCasesModel.findByIdAndUpdate(
    req.params.scheduledTestCaseID,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  const scheduledTC = await query;

  // If Scheduled test case does not exist
  if (!scheduledTC) {
    return next(
      new AppError(
        `Scheduled test case ${req.params.scheduledTestCaseID} does not exist.`
      )
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message,
    data: { scheduledTestCase: scheduledTC }
  });
});

// GOOD
exports.deleteScheduledTestCase = catchAsync(async (req, res, next) => {
  const { scheduledTestSuiteID, scheduledTestCaseID } = req.params;
  //1. Check if the test suite exists
  const scheduledTestSuite = await ScheduledTestSuitesModel.findById(
    scheduledTestSuiteID
  );

  //1.a if test suite does not exists
  if (!scheduledTestSuite) {
    return next(
      new AppError(
        `Scheduled test suite ${scheduledTestSuiteID} does not exist`,
        404
      )
    );
  }

  //1.b if test case does not exist
  if (!scheduledTestSuite.testCases.includes(scheduledTestCaseID)) {
    return next(
      new AppError(
        `Scheduled test case ${scheduledTestCaseID} does not exist`,
        404
      )
    );
  }

  //2. delete scheduled test case
  await ScheduledTestCasesModel.findByIdAndDelete(scheduledTestCaseID);

  //3.remove scheduled test case on the scheduled test suites
  lodash.remove(scheduledTestSuite.testCases, function(id) {
    // eslint-disable-next-line eqeqeq
    if (id == scheduledTestCaseID) return id; // had to use loose equality here to type diff
  });

  await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduledTestSuiteID,
    { testCases: scheduledTestSuite.testCases },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: 'Scheduled Test Case was succesfully deleted'
  });
});

exports.getScheduledTestCases = catchAsync(async (req, res, next) => {
  const queryParams = { ...req.query };
  Object.keys(queryParams).forEach(param => {
    if (!acceptedGetParams.includes(param)) {
      delete queryParams[param];
    }
  });

  if (Object.keys(queryParams).length === 0) {
    return next(new AppError(`Specify a correct query parameter`, 400));
  }

  const testCases = await ScheduledTestCasesModel.find(queryParams);
  remove__v(testCases);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    count: testCases.length,
    data: { testCases }
  });
});
