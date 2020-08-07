const TestSuiteModel = require('./../models/testSuiteModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//GOOD
exports.createTestSuite = catchAsync(async (req, res, next) => {
  req.body.modifiedBy = req.body.creator;
  const query = TestSuiteModel.create(req.body);
  const suite = await query;

  //setting __v to undefined to hide in from the response. This is not persisted to DB
  suite.__v = undefined;
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    data: { suite }
  });
});

// GOOD
exports.updateTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  const suite = await query;
  //setting __v to undefined to hide in from the response. This is not persisted to DB
  suite.__v = undefined;
  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: suite
  });
});

// GOOD
exports.getAllTestSuites = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.find();

  const testSuites = await query;
  //setting __v to undefined to hide in from the response. This is not persisted to DB
  testSuites.__v = undefined;

  // TO hide __v in the response
  testSuites.forEach(suite => {
    suite.__v = undefined;
  });

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    count: testSuites.length,
    data: { testSuites }
  });
});

//GOOD
exports.getTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findById(req.params.id).populate([
    {
      path: 'testCases',
      select: 'title _id creator'
    },
    {
      path: 'scheduledTest',
      select: 'title _id testerName scheduledBy'
    }
  ]);

  const testSuite = await query;
  //setting __v to undefined to hide in from the response. This is not persisted to DB
  testSuite.__v = undefined;

  if (!testSuite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: { testSuite }
  });
});

//GOOD
exports.deleteTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuiteModel.findByIdAndDelete(req.params.id);

  const suite = await query;

  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    statusCode: 200
  });
});
