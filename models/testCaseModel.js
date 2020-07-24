const mongoose = require('mongoose');

const testCaseSchema = mongoose.Schema({
  title: {
    type: String
  },
  status: {
    type: String
  },
  testerName: {
    type: String
  },
  relatedProblems: {
    type: [String]
  },
  attachedImages: {
    type: [String]
  },
  attachedFiles: {
    type: [String]
  },
  preRequisites: {
    type: String
  },
  testSteps: {
    type: String
  },
  testData: {
    type: String
  },
  postConditions: {
    type: String
  },
  expectedResults: {
    type: String
  },
  actualResults: {
    type: String
  },
  parentTS: {
    type: String
  },
  parentST: {
    type: String
  },
  priority: {
    type: Number
  },
  dateCreated: {
    type: Date
  },
  dateModified: {
    type: Date
  }
});

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;
