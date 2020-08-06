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
    req.params.scheduledTestSuiteID,
    req.body,
    {
      new: true
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
  //if test suite does not exists
  if (!scheduledTestSuite) {
    return next(
      new AppError(
        `Scheduled test suite ${scheduledTestSuiteID} does not exist`,
        404
      )
    );
  }

  console.log(scheduledTestSuite.testCases);
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

  console.log(delTC);

  //remove scheduled test case on the scheduled test suites

  // console.log(scheduledTestSuiteID);

  const newTestCases = [...scheduledTestSuite.testCases];
  // console.log(newTestCases);
});
