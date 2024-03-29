const mongoose = require('mongoose');
const TestSuite = require('./testSuiteModel');
const AppError = require('./../utils/appError');

const scheduledTestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 500,
      minlength: 5,
      trim: true
    },
    testSuiteID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true
    },
    milestone: {
      type: String,
      max: 100,
      required: true
    },
    type: {
      type: String,
      max: 100,
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
    scheduledBy: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true,
      immutable: true
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
    testCases: [{ type: mongoose.Schema.Types.ObjectId }],
    priority: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

scheduledTestSchema.pre('save', async function(next) {
  // To check if testSuiteID exist before saving
  const testSuite = await TestSuite.findById(this.testSuiteID);
  if (!testSuite) {
    return next(
      new AppError(`TestSuiteID: ${this.testSuiteID} does not exist`, 404)
    );
  }
});

scheduledTestSchema.post('save', async function(doc, next) {
  const testSuite = await TestSuite.findById(this.testSuiteID);
  if (!testSuite) {
    return next(
      new AppError(`TestSuiteID: ${this.testSuiteID} does not exist`, 404)
    );
  }

  testSuite.scheduledTest.push(this._id);
  await TestSuite.findByIdAndUpdate(this.testSuiteID, {
    scheduledTest: testSuite.scheduledTest
  });
});

const ScheduledTest = mongoose.model('ScheduledTestSuite', scheduledTestSchema);

module.exports = ScheduledTest;
