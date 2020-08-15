const lodash = require('lodash');
const TestCase = require('../models/baseTestCaseModel');
const TestSuite = require('../models/testSuiteModel');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError');
// eslint-disable-next-line camelcase
const remove__v = require('./../utils/remove__v');
const validateObjectId = require('../utils/validateObjectId');

// GOOD
exports.createTestCases = catchAsync(async (req, res, next) => {
  req.body.modifiedBy = req.body.creator;
  const queryTC = TestCase.create(req.body);
  const testCase = await queryTC;

  //setting __v to undefined to hide in from the response. This is not persisted to DB
  remove__v(testCase);
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    message: `Test case with ID <${testCase._id}> has been successfully created`
  });
});

// GOOD
exports.getAllTestCase = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.tsID);
  const query = TestCase.find({ testSuiteID: req.params.tsID });
  const testCases = await query;

  if (testCases.length === 0) {
    return next(
      new AppError(`This test suite ${req.params.tsID} does not exist.`, 404)
    );
  }

  remove__v(testCases);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    count: testCases.length,
    data: { testCases }
  });
});

// GOOD
//review query, maybe findById will work
//review router as well
exports.getTestCase = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.tsID);
  validateObjectId(req.params.id);
  const query = TestCase.find({
    testSuiteID: req.params.tsID,
    _id: req.params.id
  });

  const testCase = await query;

  remove__v(testCase);

  if (!testCase[0]) {
    return next(
      new AppError(
        `Test case with ID ${req.params.id} or Test Suite with ID ${req.params.tsID} does not exists`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: testCase
  });
});

// GOOD
//Review query, maybe findByIdAndUpdate will work
//review router as well
exports.updateTestCase = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.tsID);
  validateObjectId(req.params.id);
  const query = TestCase.findOneAndUpdate(
    {
      testSuiteID: req.params.tsID,
      _id: req.params.id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  const testCase = await query;

  if (!testCase) {
    return next(
      new AppError(
        `Test case with ID ${req.params.id} or Test Suite with ID ${req.params.tsID} does not exists`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: `Test case with ID ${req.params.id} has been successfully updated.`
  });
});

// GOOD
exports.deleteTestCase = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.tsID);
  validateObjectId(req.params.id);
  const query = TestCase.findOneAndDelete({
    testSuiteID: req.params.tsID,
    _id: req.params.id
  });

  const testCase = await query;
  if (!testCase) {
    return next(
      new AppError(
        `Test case with ID ${req.params.id} or Test Suite with ID ${req.params.tsID} does not exists`,
        404
      )
    );
  }

  //for removing deleted test case id on test suite
  const testSuite = await TestSuite.findById(req.params.tsID);
  lodash.remove(testSuite.testCases, function(id) {
    // eslint-disable-next-line eqeqeq
    if (id == req.params.id) {
      return id;
    }
  });
  // testSuite.testCases.splice(testSuite.testCases.indexOf(req.params.id), 1);
  await TestSuite.findByIdAndUpdate(
    req.params.tsID,
    {
      testCases: testSuite.testCases
    },
    { runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: `Test case with ID ${req.params.id} has been successfully deleted.`
  });
});
