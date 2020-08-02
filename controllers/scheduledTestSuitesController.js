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

exports.scheduleTest = catchAsync(async (req, res, next) => {
  //add additional params to the body
  req.body.modifiedBy = req.body.scheduledBy;
  req.body.testerName = req.body.scheduledBy;
  //Query the root test suite being scheduled
  const rootTestSuite = await TestSuiteModel.findById(req.body.testSuiteID);
  req.body.title = rootTestSuite.title;
  req.body.testCases = rootTestSuite.testCases;
  //Create Scheduled Test Suite
  const scheduledTest = await ScheduledTestSuitesModel.create(req.body);
  scheduledTest.__v = undefined;
  // Create individual test cases
  const rootTestCases = await BaseTestCaseModel.find({
    _id: { $in: scheduledTest.testCases }
  });

  console.log('TC', scheduledTest.testCases);
  const body = rootTestCases.map(obj => {
    const tc = Object.assign({}, obj._doc);
    tc.testerName = scheduledTest.testerName;
    tc.scheduledBy = scheduledTest.scheduledBy;
    tc.modifiedBy = scheduledTest.scheduledBy;
    tc.scheduledTestSuiteID = scheduledTest._id;
    tc.rootTestCaseID = tc._id;
    // console.log('BEFORE', tc);
    cleanObject(tc, acceptedTCParams);
    // console.log('AFTER', tc);
    return ScheduledTestCasesModel.create(tc);
  });
  await Promise.all(body);

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
