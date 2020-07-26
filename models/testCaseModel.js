const mongoose = require('mongoose');

const testCaseSchema = mongoose.Schema(
  {
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
    status: {
      type: String,
      enum: [
        'NOT STARTED',
        'IN PROGRESS',
        'PASS',
        'FAIL',
        'BLOCKED',
        'OUT OF SCOPE'
      ],
      default: 'NOT STARTED'
    },
    testerName: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true
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
      type: String,
      maxlength: 5000,
      default: null
    },
    testSteps: {
      type: String,
      maxlength: 5000,
      required: true
    },
    testData: {
      type: String,
      maxlength: 5000,
      default: null
    },
    postConditions: {
      type: String,
      maxlength: 5000,
      default: null
    },
    expectedResults: {
      type: String,
      maxlength: 5000,
      required: true
    },
    actualResults: {
      type: String,
      maxlength: 5000
    },
    notes: {
      type: String,
      maxlength: 5000
    },
    parentTS: {
      type: String,
      maxlength: 100,
      default: null
    },
    parentST: {
      type: String,
      maxlength: 100,
      default: null
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 5
    },
    dateCreated: {
      type: Date
    },
    dateModified: {
      type: Date
    }
  },
  { timestamps: true }
);

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;
