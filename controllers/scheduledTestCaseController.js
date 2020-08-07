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

//no validation yet if the resource being updated exists
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
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message,
    data: { scheduledTestCase: scheduledTC }
  });
});

//no validation yet if the resource being deleted exists
exports.deleteScheduledTestCase = catchAsync(async (req, res, next) => {
  const { scheduledTestSuiteID, scheduledTestCaseID } = req.params;
  //Check if the test suite exists
  const scheduledTestSuite = await ScheduledTestSuitesModel.findById(
    scheduledTestSuiteID
  );

  console.log(scheduledTestSuite);
  //if test suite does not exists
  if (!scheduledTestSuite) {
    return next(
      new AppError(
        `Scheduled test suite ${scheduledTestSuiteID} does not exist`,
        404
      )
    );
  }

  // console.log(scheduledTestSuite.testCases);
  //if test case does not exist
  if (!scheduledTestSuite.testCases.includes(scheduledTestCaseID)) {
    return next(
      new AppError(
        `Scheduled test case ${scheduledTestCaseID} does not exist`,
        404
      )
    );
  }
  //delete scheduled test case
  const delTC = await ScheduledTestCasesModel.findByIdAndDelete(
    scheduledTestCaseID
  );

  // console.log(scheduledTestCaseID);

  //remove scheduled test case on the scheduled test suites

  console.log('scheduledTestCaseID', scheduledTestCaseID);
  console.log('scheduledTestsuiteID', scheduledTestSuiteID);

  // const newTestCases = [...scheduledTestSuite.testCases];
  console.log('before tc', scheduledTestSuite.testCases);
  const newTestCases = lodash.remove(scheduledTestSuite.testCases, function(
    id
  ) {
    // eslint-disable-next-line eqeqeq
    if (id == scheduledTestCaseID) return id; // had to use loose equality here to type diff
  });
  console.log('newTc', newTestCases);
  console.log('before tc', scheduledTestSuite.testCases);

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
