const TestCase = require('./../models/testCaseModel');

exports.createTestCases = async (req, res) => {
  try {
    const query = TestCase.create(req.body);

    const testCase = await query;
    res.status(201).json({
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

exports.getAllTestCase = async (req, res) => {
  try {
    const query = TestCase.find();

    const testCases = await query;
    res.status(200).json({
      status: 'success',
      count: testCases.length,
      data: testCases
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      data: err
    });
  }
};

exports.getTestCase = async (req, res) => {
  try {
    const query = TestCase.findById(req.params.id);

    const testCase = await query;
    // console.log(req.params);
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

exports.updateTestCase = async (req, res) => {
  try {
    const query = TestCase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    const testCase = await query;
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

exports.deleteTestCase = async (req, res) => {
  try {
    const query = TestCase.findByIdAndDelete(req.params.id);

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
