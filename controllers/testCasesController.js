const TestCase = require('./../models/testCaseModel');
const TestSuite = require('./../models/testSuiteModel');

exports.createTestCases = async (req, res) => {
  try {
    const body = { ...req.body };
    body.testSuiteID = req.body.tsID;

    const queryTC = TestCase.create(body);
    const testCase = await queryTC;

    //for adding a test case reference to test suite
    const testSuite = await TestSuite.findById(req.body.tsID);
    testSuite.testCases.push(testCase._id);
    await TestSuite.findByIdAndUpdate(req.body.tsID, {
      testCases: testSuite.testCases
    });

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

// this method can be removed
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
