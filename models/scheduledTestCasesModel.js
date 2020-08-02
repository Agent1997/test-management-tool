const mongoose = require('mongoose');

const scheduledTestCasesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 500,
      minlength: 5,
      trim: true
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
    scheduledBy: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true
    },
    modifiedBy: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true
    },
    relatedProblems: [{ type: mongoose.Schema.Types.ObjectId }],
    attachedImages: {
      type: [String]
    },
    attachedFiles: {
      type: [String]
    },
    actualResults: {
      type: String,
      maxlength: 6000,
      default: null
    },
    scheduledTestSuiteID: {
      type: String,
      required: true
    },
    testSuiteID: {
      type: String,
      required: true
    },
    rootTestCaseID: {
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
  },
  { timestamps: true }
);

// scheduledTestCasesSchema.pre('save', function() {
//   throw new Error("Can't save document");
// });

const ScheduledTestCasesModel = mongoose.model(
  'ScheduledTestCase',
  scheduledTestCasesSchema
);

module.exports = ScheduledTestCasesModel;
