// const ScheduledTestSuitesModel = require('../models/scheduledTestSuitesModel');
const TestSuiteModel = require('../models/testSuiteModel');
const BaseTestCaseModel = require('./../models/baseTestCaseModel');
const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const ScheduledTestSuitesModel = require('./../models/scheduledTestSuitesModel');
const catchAsync = require('./../utils/catchAsync');
const cleanObject = require('./../utils/cleanObject');

const acceptedTCParams = [
  'testData',
  'postConditions',
  'expectedResults',
  'priority',
  'actualResults',
  'scheduledTestSuiteID',
  'testSuiteID',
  'rootTestCaseID',
  'preRequisites',
  'testSteps',
  'title',
  'status',
  'testerName',
  'scheduledBy',
  'modifiedBy',
  'relatedProblems',
  'attachedFiles',
  'attachedImages'
];
const createIndTestCase = catchAsync(async testSuiteObj => {
  const rootTestCases = await BaseTestCaseModel.find({
    _id: { $in: testSuiteObj.testCases }
  });
  const body = rootTestCases.map(el => {
    const tc = Object.assign({}, el._doc);
    tc.testerName = testSuiteObj.testerName;
    tc.scheduledBy = testSuiteObj.scheduledBy;
    tc.modifiedBy = testSuiteObj.scheduledBy;
    tc.scheduledTestSuiteID = testSuiteObj._id;
    tc.rootTestCaseID = tc._id;
    // console.log('BEFORE', tc);
    cleanObject(tc, acceptedTCParams);
    // console.log('AFTER', tc);
    return ScheduledTestCasesModel.create(tc);
  });
  await Promise.all(body);
});

const singleTCSchedule = catchAsync(async (req, testSuiteID) => {
  const rootTestSuite = await TestSuiteModel.findById(testSuiteID);
  //Create Test suite
  req.body.modifiedBy = req.body.scheduledBy;
  req.body.testerName = req.body.scheduledBy;
  req.body.title = rootTestSuite.title;
  req.body.testCases = rootTestSuite.testCases;
  req.body.testSuiteID = rootTestSuite._id; //added
  const scheduledTest = await ScheduledTestSuitesModel.create(req.body);
  scheduledTest.__v = undefined;

  //Create all test cases associated with the scheduled test suite
  createIndTestCase(scheduledTest);
  return scheduledTest;
});

const massSchedule = catchAsync(async (req, testSuiteID) => {
  const testSuitesPromises = testSuiteID.map(id => {
    return singleTCSchedule(req, id);
  });
  return Promise.all(testSuitesPromises);
});

exports.scheduleTest = catchAsync(async (req, res, next) => {
  let scheduledTest;
  if (req.body.testSuiteID.length === 1) {
    scheduledTest = await singleTCSchedule(req, req.body.testSuiteID[0]);
  } else {
    scheduledTest = await massSchedule(req, req.body.testSuiteID);
  }
  //add additional params to the body
  // req.body.modifiedBy = req.body.scheduledBy;
  // req.body.testerName = req.body.scheduledBy;
  //Query the root test suite being scheduled

  // req.body.title = rootTestSuite.title;
  // req.body.testCases = rootTestSuite.testCases;
  //Create Scheduled Test Suite
  // Create individual test cases

  /*
  Work needed. Needed to check and handle 
  test cases that were not saved successfully
  */
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    // data: { scheduledTest }
    data: { scheduledTest }
  });
});
