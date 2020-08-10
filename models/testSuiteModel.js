const mongoose = require('mongoose');

const testSuiteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      minlength: 5
    },
    status: {
      type: String,
      enum: ['IN PROGRESS', 'FOR REVIEW', 'IN REVIEW', 'DONE'],
      default: 'IN PROGRESS'
    },
    priority: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    },
    version: {
      type: Number,
      max: 100,
      required: true,
      immutable: true,
      unique: true
    },
    creator: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true,
      immutable: true
    },
    modifiedBy: {
      type: String,
      maxlength: 100,
      minlength: 5,
      trim: true
    },
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BaseTestCase' }],
    scheduledTest: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledTestSuite' }
    ],
    relatedProblems: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

const TestSuiteModel = mongoose.model('TestSuite', testSuiteSchema);

module.exports = TestSuiteModel;
