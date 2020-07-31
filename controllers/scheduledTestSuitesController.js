// const ScheduledTestSuitesModel = require('../models/scheduledTestSuitesModel');
const TestSuiteModel = require('../models/testSuiteModel');
const BaseTestCaseModel = require('./../models/baseTestCaseModel');
const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const catchAsync = require('./../utils/catchAsync');

exports.scheduleTest = catchAsync(async (req, res, next) => {
  //1. Get Test suite from DB. Get useful data  from test suite: Test cases, title, prioriy, id
  const testCasesObj = await TestSuiteModel.findById(req.body.tsID).select(
    'title priority testCases _id'
  );

  const { testCases, title, _id, priority } = testCasesObj;

  console.log(priority);

  //2. Make a copy of test cases from base test cases to scheduled test testCases
  const testCaseArrPromise = testCases.map(tcID =>
    BaseTestCaseModel.findById(tcID)
  );

  const testCaseArr = await Promise.all(testCaseArrPromise);

  const completeTestCaseArr = testCaseArr.map(testcase => {
    testcase.scheduledTestSuiteID = _id;
    testcase.testerName = req.body.creatorName;
    console.log(testcase);
    return testcase;
  });
  // console.log('completeTestCaseArr', completeTestCaseArr);
  const copiedTestCasePromise = completeTestCaseArr.map(testCase => {
    const testcaseObj = testCase;
    console.log('testcaseOBJ', testcaseObj);
    return ScheduledTestCasesModel.create(testCase);
  });

  const copiedTestCases = await Promise.all(copiedTestCasePromise);
  //3. Create the schedule test suite
  //4. Return an overview of the created test suite

  // const testCasesObj = await TestSuiteModel.findById(req.body.tsID).select(
  //   'testCases title _id'
  // );

  const { body } = req;
  body.testCases = testCaseArr;
  body.title = title;
  body.testSuiteID = _id;
  // const query = ScheduledTestSuitesModel.create(body);

  // const scheduledTest = await query;

  res.status(200).json({
    status: 'success',
    // data: scheduledTest
    data: copiedTestCases
  });
});
