const lodash = require('lodash');
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
const immutableSTSParams = ['testSuiteID', 'scheduledBy'];
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
  return await Promise.all(body);
});

const singleTestSuiteSched = catchAsync(async (req, testSuiteID) => {
  const rootTestSuite = await TestSuiteModel.findById(testSuiteID);
  //Create Test suite
  req.body.modifiedBy = req.body.scheduledBy;
  req.body.testerName = req.body.scheduledBy;
  req.body.title = rootTestSuite.title;
  req.body.testSuiteID = rootTestSuite._id; //added
  const scheduledTest = await ScheduledTestSuitesModel.create(req.body);
  scheduledTest.__v = undefined;

  const scheduledTestCases = await createIndTestCase(
    scheduledTest,
    rootTestSuite.testCases
  );

  const scheduledTestCasesIDs = scheduledTestCases.map(
    testCaseObj => testCaseObj._id
  );

  const scheduledTestUpdated = await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduledTest._id,
    { testCases: scheduledTestCasesIDs },
    { new: true }
  );

  return scheduledTestUpdated; //returns a promise
});

const massSchedule = catchAsync(async (req, testSuiteID) => {
  const testSuitesPromises = testSuiteID.map(id => {
    return singleTestSuiteSched(req, id);
  });
  return Promise.all(testSuitesPromises);
});

// GOOD
exports.scheduleTest = catchAsync(async (req, res, next) => {
  let scheduledTest;
  if (req.body.testSuiteID.length === 1) {
    scheduledTest = await singleTestSuiteSched(req, req.body.testSuiteID[0]);
  } else {
    scheduledTest = await massSchedule(req, req.body.testSuiteID);
  }

  res.status(201).json({
    status: 'success',
    statusCode: 201,
    data: { scheduledTest }
  });
});

// GOOD
exports.updateScheduledTestSuite = catchAsync(async (req, res, next) => {
  const params = Object.keys(req.body);
  let message = '';
  params.forEach(key => {
    if (immutableSTSParams.includes(key)) {
      message += ` ${key} is not modifiable.`;
      delete req.body[key];
    }
  });
  const { scheduleTestSuiteID } = req.body;
  delete req.body.scheduleTestSuiteID;
  const updatedTestSuite = await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduleTestSuiteID,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message,
    data: { updatedTestSuite }
  });
});

const singleDelete = catchAsync(async (id, req, next) => {
  const deletedScheduledTestSuite = await ScheduledTestSuitesModel.findByIdAndDelete(
    id
  );
  console.log(deletedScheduledTestSuite);

  const baseTestSuite = await TestSuiteModel.findById(
    deletedScheduledTestSuite.testSuiteID
  );

  lodash.remove(baseTestSuite.scheduledTest, function(baseID) {
    // eslint-disable-next-line eqeqeq
    if (baseID == id) return baseID;
  });

  const updatedTestSuite = await TestSuiteModel.findByIdAndUpdate(
    deletedScheduledTestSuite.testSuiteID,
    { scheduledTest: baseTestSuite.scheduledTest },
    { new: true, runValidators: true }
  );

  console.log(updatedTestSuite);
});

exports.deleteScheduledTestSuite = catchAsync(async (req, res, next) => {
  if (req.body.scheduledTestSuitedID.length === 1) {
    await singleDelete(req.body.scheduledTestSuitedID[0], req, next);
  }
});
