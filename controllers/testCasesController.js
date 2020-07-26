const TestCase = require('./../models/testCaseModel');

exports.createTestCases = async (req, res) => {
  try {
    const body = { ...req.body };
    body.testSuiteID = req.params.tsID;

    const query = TestCase.create(body);
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
    const query = TestCase.find({ testSuiteID: req.params.tsID });

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
    const query = TestCase.find({
      testSuiteID: req.params.tsID,
      _id: req.params.id
    });

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
    const query = TestCase.findOneAndDelete({
      testSuiteID: req.params.tsID,
      _id: req.params.id
    });

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
