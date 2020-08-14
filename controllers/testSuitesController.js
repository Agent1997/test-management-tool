const TestSuiteModel = require('./../models/testSuiteModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const immutable = ['version', 'creator'];

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
    message: `Test Suite with id ${suite._id} has been successfully created`
  });
});

// GOOD
exports.updateTestSuite = catchAsync(async (req, res, next) => {
  const params = Object.keys(req.body);

  if (params.length === 0) {
    return next(new AppError('Payload is empty', 400));
  }
  let message;
  params.forEach(key => {
    if (immutable.includes(key)) {
      message += ` ${key} is not modifiable.`;
      delete req.body[key];
    }
  });

  const existenceCheck = await TestSuiteModel.findById(req.params.id);
  if (!existenceCheck) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

  const query = TestSuiteModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  const suite = await query;

  //setting __v to undefined to hide in from the response. This is not persisted to DB
  suite.__v = undefined;

  message = `Test Suite with id ${req.params.id} has been successfully updated`;

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message
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
  const suite = await TestSuiteModel.findById(req.params.id);
  if (!suite) {
    return next(
      new AppError(`Test Suite with ID ${req.params.id} does not exists`, 404)
    );
  }

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
    statusCode: 200,
    message: `Test suite with ID ${req.params.id} has been successfully deleted`
  });
});
