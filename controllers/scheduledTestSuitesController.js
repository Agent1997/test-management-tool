const lodash = require('lodash');
const TestSuiteModel = require('../models/testSuiteModel');
const BaseTestCaseModel = require('./../models/baseTestCaseModel');
const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const ScheduledTestSuitesModel = require('./../models/scheduledTestSuitesModel');
const catchAsync = require('./../utils/catchAsync');
const cleanObject = require('./../utils/cleanObject');
const AppError = require('./../utils/appError');
const compareArrays = require('./../utils/compareArrays');
const validateObjectId = require('../utils/validateObjectId');
// eslint-disable-next-line camelcase
const remove__v = require('./../utils/remove__v');

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
const acceptedGetParams = [
  'testSuiteID',
  'milestone',
  'type',
  'status',
  'testerName',
  'scheduledBy',
  'modifiedBy',
  'priority',
  '_id'
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
  return await Promise.all(body);
});

const singleTestSuiteSched = catchAsync(async (req, testSuiteID) => {
  const rootTestSuite = await TestSuiteModel.findById(testSuiteID);
  if (!rootTestSuite) {
    throw new AppError(`Test Suite with ID <${testSuiteID}> does not`, 404);
  }
  // console.log('TEST');
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
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return next(new AppError(`Request Body is empty`, 400));
  }

  if (!req.body.testSuiteID) {
    return next(new AppError(`Test suite ID is a required parameter`, 400));
  }

  const scheduledTestIDs = [];
  const testSuiteIDs = req.body.testSuiteID;
  let scheduledTest;
  let message = null;
  if (testSuiteIDs.length === 1) {
    const id = req.body.testSuiteID[0];
    scheduledTest = await singleTestSuiteSched(req, id);
    if (scheduledTest) {
      message = `Test suite with ID ${id} was successfully scheduled.`;
    }
    const { testSuiteID, _id } = scheduledTest;
    scheduledTestIDs.push({ testSuiteID, scheduledTestId: _id });
  } else {
    const testSuites = await TestSuiteModel.find({ _id: testSuiteIDs });
    const results = compareArrays(testSuites, testSuiteIDs);
    if (results.present.length === 0) {
      return next(
        new AppError(`Test Suite ID's ${testSuiteIDs} do not exist`, 404)
      );
    }
    scheduledTest = await massSchedule(req, results.present);
    scheduledTest.forEach(el => {
      const { testSuiteID, _id } = el;
      scheduledTestIDs.push({ testSuiteID, scheduledTestId: _id });
    });

    if (results.notPresent.length > 0) {
      message = `Test suite/s with ID ${results.present} was successfully scheduled. And Test Suite/s with ID ${results.notPresent} was not scheduled because they no longer exists.`;
    } else {
      message = `Test suite/s with ID ${results.present} was successfully scheduled.`;
    }
  }

  res.status(201).json({
    status: 'success',
    statusCode: 201,
    message,
    scheduledTestIDs
  });
});

// GOOD
exports.updateScheduledTestSuite = catchAsync(async (req, res, next) => {
  // Can only support single update
  validateObjectId(req.body.scheduleTestSuiteID[0]);
  const params = Object.keys(req.body);
  params.forEach(key => {
    if (immutableSTSParams.includes(key)) {
      delete req.body[key];
    }
  });
  const { scheduleTestSuiteID } = req.body;
  delete req.body.scheduleTestSuiteID;
  const updated = await ScheduledTestSuitesModel.findByIdAndUpdate(
    scheduleTestSuiteID[0],
    req.body,
    { new: true, runValidators: true }
  );

  if (!updated) {
    return next(
      new AppError(
        `Scheduled test suite with ID ${scheduleTestSuiteID[0]} does not exist`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: `Test suite with ID ${scheduleTestSuiteID} was successfully updated.`
  });
});

const singleDelete = async (id, req, next) => {
  validateObjectId(id);
  const deletedScheduledTestSuite = await ScheduledTestSuitesModel.findByIdAndDelete(
    id
  );

  if (!deletedScheduledTestSuite) {
    throw new AppError(
      `Scheduled Test Suite with ID ${id} does not exist`,
      404
    );
  }

  const baseTestSuite = await TestSuiteModel.findById(
    deletedScheduledTestSuite.testSuiteID
  );

  if (!baseTestSuite) {
    throw new AppError(
      `Test Suite with ID ${deletedScheduledTestSuite.testSuiteID} associated with Scheduled Test Suite with ID ${id} does not exist`,
      404
    );
  }

  lodash.remove(baseTestSuite.scheduledTest, function(baseID) {
    // eslint-disable-next-line eqeqeq
    if (baseID == id) return baseID;
  });

  await TestSuiteModel.findByIdAndUpdate(
    deletedScheduledTestSuite.testSuiteID,
    { scheduledTest: baseTestSuite.scheduledTest },
    { new: true, runValidators: true }
  );
};

// GODD
exports.deleteScheduledTestSuite = catchAsync(async (req, res, next) => {
  const { scheduledTestSuiteID } = req.body;
  if (!scheduledTestSuiteID) {
    return next(
      new AppError(
        `ID of scheduled test suite is missing in the request body`,
        400
      )
    );
  }
  if (scheduledTestSuiteID.length === 1) {
    await singleDelete(scheduledTestSuiteID[0], req, next);
  }

  // TODO: mass deleted
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: `Scheduled test suite with ID ${scheduledTestSuiteID} was successfully deleted.`
  });
});

// GOOD
exports.getScheduledTestSuite = catchAsync(async (req, res, next) => {
  const queryParams = { ...req.query };
  if (queryParams._id) {
    validateObjectId(queryParams._id);
  }
  if (queryParams.testSuiteID) {
    validateObjectId(queryParams.testSuiteID);
  }

  //remove unwanted query params
  Object.keys(queryParams).forEach(key => {
    if (!acceptedGetParams.includes(key)) delete queryParams[key];
  });

  if (Object.keys(queryParams).length === 0) {
    return next(new AppError(`Specify a correct query parameter`, 400));
  }
  const scheduledTestSuites = await ScheduledTestSuitesModel.find(queryParams);
  if (scheduledTestSuites.length === 0) {
    return next(
      new AppError(
        `Scheduled Test Suite with ID ${Object.values(
          queryParams
        )} does not exist`,
        404
      )
    );
  }
  remove__v(scheduledTestSuites);
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    count: scheduledTestSuites.length,
    data: { scheduledTestSuites }
  });
});
