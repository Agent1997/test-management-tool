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
  //Create Test Suite
  req.body.modifiedBy = req.body.scheduledBy;
  req.body.testerName = req.body.scheduledBy;
  // console.log(acceptedTCParams);

  const query = ScheduledTestSuitesModel.create(req.body);
  const scheduledTest = await query;
  scheduledTest.__v = undefined;

  // Create individual test cases
  const rootTestCases = await BaseTestCaseModel.find({
    _id: { $in: scheduledTest.testCases }
  });
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

  const docs = await Promise.all(body);
  console.log(docs.length);

  res.status(201).json({
    status: 'success',
    statusCode: 201,
    // data: { scheduledTest }
    data: { scheduledTest }
  });
});
