const TestSuite = require('./../models/testSuiteModel');

//MVP
exports.createTestSuite = async (req, res) => {
  try {
    const query = TestSuite.create(req.body);

    const suite = await query;

    res.status(201).json({
      status: 'success',
      data: suite
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.updateTestSuite = async (req, res) => {
  try {
    const query = TestSuite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    const suite = await query;

    res.status(200).json({
      status: 'success',
      data: suite
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.getAllTestSuites = async (req, res) => {
  try {
    const query = TestSuite.find().select('status version _id title creator');

    const suite = await query;

    res.status(200).json({
      status: 'success',
      count: suite.length,
      data: suite
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.getTestSuite = async (req, res) => {
  try {
    const query = TestSuite.findById(req.params.id).populate({
      path: 'testCases',
      select: 'status title _id testerName'
    });

    const suite = await query;

    res.status(200).json({
      status: 'success',
      data: suite
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.deleteTestSuite = async (req, res) => {
  try {
    const query = TestSuite.findByIdAndDelete(req.params.id);

    await query;

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
