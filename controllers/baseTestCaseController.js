const TestCase = require('../models/baseTestCaseModel');
const TestSuite = require('../models/testSuiteModel');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError');
// MVP
exports.createTestCases = catchAsync(async (req, res, next) => {
  if (!req.body.tsID) {
    return res.status(400).json({
      statusCode: 400,
      message: 'tsID is required'
    });
  }

  const body = { ...req.body };
  body.testSuiteID = req.body.tsID;

  const queryTC = TestCase.create(body);
  const testCase = await queryTC;

  res.status(201).json({
    status: 'success',
    data: testCase
  });
});

// this method can be removed
exports.getAllTestCase = catchAsync(async (req, res, next) => {
  const query = TestCase.find({ testSuiteID: req.params.tsID });

  const testCases = await query;
  res.status(200).json({
    status: 'success',
    count: testCases.length,
    data: testCases
  });
});

exports.getTestCase = catchAsync(async (req, res, next) => {
  const query = TestCase.find({
    testSuiteID: req.params.tsID,
    _id: req.params.id
  });

  const testCase = await query;

  if (!testCase[0]) {
    return next(
      new AppError(`Test case with ID ${req.params.id} does not exists`, 404)
    );
  }
  // console.log(req.params);
  res.status(200).json({
    status: 'success',
    data: testCase
  });
});

exports.updateTestCase = async (req, res, next) => {
  try {
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
        new AppError(`Test case with ID ${req.params.id} does not exists`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: testCase
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.deleteTestCase = async (req, res, next) => {
  try {
    const query = TestCase.findOneAndDelete({
      testSuiteID: req.params.tsID,
      _id: req.params.id
    });

    const testCase = await query;
    if (!testCase) {
      return next(
        new AppError(`Test case with ID ${req.params.id} does not exists`, 404)
      );
    }

    //for adding a test case reference to test suite
    const testSuite = await TestSuite.findById(req.params.tsID);
    testSuite.testCases.splice(testSuite.testCases.indexOf(req.params.id), 1);
    await TestSuite.findByIdAndUpdate(req.params.tsID, {
      testCases: testSuite.testCases
    });

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};
