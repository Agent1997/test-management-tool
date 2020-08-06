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
const createIndTestCase = catchAsync(async (testSuiteObj, testCases) => {
  const rootTestCases = await BaseTestCaseModel.find({
    _id: { $in: testCases }
  });
  const body = rootTestCases.map(el => {
    const tc = Object.assign({}, el._doc);
    tc.testerName = testSuiteObj.testerName;
    tc.scheduledBy = testSuiteObj.scheduledBy;
    tc.modifiedBy = testSuiteObj.scheduledBy;
    tc.scheduledTestSuiteID = testSuiteObj._id;
    tc.rootTestCaseID = tc._id;
    cleanObject(tc, acceptedTCParams);
    return ScheduledTestCasesModel.create(tc);
  });
  // console.log('Indvidual TC', await Promise.all(body));
  return await Promise.all(body);
  // await Promise.all(body);
});

const singleTestSuiteSched = catchAsync(async (req, testSuiteID) => {
  const rootTestSuite = await TestSuiteModel.findById(testSuiteID);
  //Create Test suite
  req.body.modifiedBy = req.body.scheduledBy;
  req.body.testerName = req.body.scheduledBy;
  req.body.title = rootTestSuite.title;
  // req.body.testCases = rootTestSuite.testCases; //removed this line because the test cases
  //related to the root test suite is being saved in the scheduled test suite which should not be saved
  //it should contain the id of the created schedule test cases
  req.body.testSuiteID = rootTestSuite._id; //added
  const scheduledTest = await ScheduledTestSuitesModel.create(req.body);

  console.log('scheduled test', scheduledTest);
  scheduledTest.__v = undefined;

  //Create all test cases associated with the scheduled test suite
  // createIndTestCase(scheduledTest, rootTestSuite.testCases);

  const scheduledTestCases = await createIndTestCase(
    scheduledTest,
    rootTestSuite.testCases
  );

  const scheduledTestCasesIDs = scheduledTestCases.map(
    testCaseObj => testCaseObj._id
  );

  console.log('scheduledTest._id', scheduledTest._id);
  // console.log('sched test from single tc', scheduledTestCases);
  console.log('sched test from single tc IDs', scheduledTestCasesIDs);

  const scheduledTestUpdated = await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduledTest._id,
    { testCases: scheduledTestCasesIDs },
    { new: true }
  );

  //TODO: create test suites. then create individual test cases. wait to finish. then gather ID's, then update scheduled test suite

  console.log('updated testsuite', scheduledTestUpdated);
  return scheduledTestUpdated; //returns a promise
});

const massSchedule = catchAsync(async (req, testSuiteID) => {
  const testSuitesPromises = testSuiteID.map(id => {
    return singleTestSuiteSched(req, id);
  });
  // console.log('Test suite promises', testSuitesPromises);
  return Promise.all(testSuitesPromises);
});

/*
all test cases associated with the test suite will be scheduled, user will 
have to manually delete unnecessary test cases on the scheduled test suite
*/
exports.scheduleTest = catchAsync(async (req, res, next) => {
  let scheduledTest;
  if (req.body.testSuiteID.length === 1) {
    scheduledTest = await singleTestSuiteSched(req, req.body.testSuiteID[0]);
    // console.log('single sched', scheduledTest);
  } else {
    scheduledTest = await massSchedule(req, req.body.testSuiteID);
    // console.log('mass sched', scheduledTest);
  }

  res.status(201).json({
    status: 'success',
    statusCode: 201,
    data: { scheduledTest }
  });
});
