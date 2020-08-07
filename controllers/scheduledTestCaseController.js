const lodash = require('lodash');
const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const ScheduledTestSuitesModel = require('./../models/scheduledTestSuitesModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const immutable = [
  'scheduledBy',
  'scheduledTestSuiteID',
  'testSuiteID',
  'rootTestCaseID'
];

exports.updateScheduledTestCase = catchAsync(async (req, res, next) => {
  const params = Object.keys(req.body);
  let message = '';
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

  const updatedTestSuite = await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduledTestSuiteID,
    { testCases: scheduledTestSuite.testCases },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: { updatedTestSuite }
  });
});
