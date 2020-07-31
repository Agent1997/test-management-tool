const TestSuite = require('./../models/testSuiteModel');

const catchAsync = require('./../utils/catchAsync');

//MVP
exports.createTestSuite = catchAsync(async (req, res, next) => {
  req.body.modifiedBy = req.body.creator;
  const query = TestSuite.create(req.body);
  const suite = await query;
  res.status(201).json({
    status: 'success',
    data: suite
  });
});

/*
Below functions will be updated
*/

exports.updateTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuite.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  const suite = await query;

  res.status(200).json({
    status: 'success',
    data: suite
  });
});

exports.getAllTestSuites = catchAsync(async (req, res, next) => {
  const query = TestSuite.find().select('status version _id title creator');

  const suite = await query;

  res.status(200).json({
    status: 'success',
    count: suite.length,
    data: suite
  });
});

exports.getTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuite.findById(req.params.id).populate({
    path: 'testCases',
    select: 'status title _id testerName'
  });

  const suite = await query;

  res.status(200).json({
    status: 'success',
    data: suite
  });
});

exports.deleteTestSuite = catchAsync(async (req, res, next) => {
  const query = TestSuite.findByIdAndDelete(req.params.id);

  await query;

  res.status(200).json({
    status: 'success'
  });
});
