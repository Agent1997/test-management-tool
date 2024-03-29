const TestSuiteModel = require('./../models/testSuiteModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// eslint-disable-next-line camelcase
const remove__v = require('./../utils/remove__v');
const validateObjectId = require('../utils/validateObjectId');

const acceptedUpdateParams = ['title', 'status', 'priority', 'modifiedBy'];

//GOOD
exports.createTestSuite = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return next(new AppError(`Request Body is empty`, 400));
  }

  console.log('type of', typeof req.body.version);

  req.body.modifiedBy = req.body.creator;
  const query = TestSuiteModel.create(req.body);
  const suite = await query;

  //setting __v to undefined to hide in from the response. This is not persisted to DB
  remove__v(suite);
  res.status(201).json({
    status: 'success',
    statusCode: 201,
    message: `Test Suite with id <${suite._id}> has been successfully created`
  });
});

// GOOD
exports.updateTestSuite = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.id);
  const params = Object.keys(req.body);

  if (params.length === 0) {
    return next(new AppError('Payload is empty', 400));
  }
  params.forEach(key => {
    if (!acceptedUpdateParams.includes(key)) {
      delete req.body[key];
    }
  });

  if (Object.keys(req.body).length === 0) {
    return next(
      new AppError(
        `The fields you are tring to update are immutable or does not exists`,
        400
      )
    );
  }

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
  remove__v(suite);

  const message = `Test Suite with id ${req.params.id} has been successfully updated`;

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
  remove__v(testSuites);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    count: testSuites.length,
    data: { testSuites }
  });
});

//GOOD
exports.getTestSuite = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.id);
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
  remove__v(testSuite);

  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: { testSuite }
  });
});

//GOOD
exports.deleteTestSuite = catchAsync(async (req, res, next) => {
  validateObjectId(req.params.id);
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
