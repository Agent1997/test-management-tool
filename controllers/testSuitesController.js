const TestSuiteModel = require('./../models/testSuiteModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createTestSuite = catchAsync(async (req, res, next) => {
  req.body.modifiedBy = req.body.creator;
  const query = TestSuiteModel.create(req.body);
  const suite = await query;

  //setting __v to undefined to hide in from the response. This is not persisted to DB
  suite.__v = undefined;
  res.status(201).json({
    status: 'success',
    data: { suite }
  });
});

/*
Below functions will be updated
*/

exports.updateTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  const suite = await query;
  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: suite
  });
});

exports.getAllTestSuites = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.find().select(
    'status version _id title creator'
  );

  const suite = await query;

  res.status(200).json({
    status: 'success',
    count: suite.length,
    data: suite
  });
});

exports.getTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findById(req.params.id).populate({
    path: 'testCases',
    select: 'status title _id testerName'
  });

  const suite = await query;

  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: suite
  });
});

exports.deleteTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findByIdAndDelete(req.params.id);

  const suite = await query;

  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success'
  });
});
