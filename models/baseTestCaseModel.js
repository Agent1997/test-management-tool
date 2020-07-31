const mongoose = require('mongoose');
const TestSuite = require('./testSuiteModel');

const baseTestCaseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
    minlength: 5,
    trim: true
  },
  testSuiteID: {
    type: String,
    required: true
  },
  preRequisites: {
    type: String,
    maxlength: 6000,
    default: null
  },
  testSteps: {
    type: String,
    maxlength: 6000,
    required: true
  },
  testData: {
    type: String,
    maxlength: 6000,
    default: null
  },
  postConditions: {
    type: String,
    maxlength: 6000,
    default: null
  },
  expectedResults: {
    type: String,
    maxlength: 6000,
    required: true
  },
  priority: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0
  }
});

baseTestCaseSchema.post('save', async function() {
  //for adding a test case reference to test suite
  const testSuite = await TestSuite.findById(this.testSuiteID);
  testSuite.testCases.push(this._id);
  await TestSuite.findByIdAndUpdate(this.testSuiteID, {
    testCases: testSuite.testCases
  });
});

const BaseTestCaseModel = mongoose.model('BaseTestCase', baseTestCaseSchema);

module.exports = BaseTestCaseModel;
