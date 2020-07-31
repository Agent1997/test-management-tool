const mongoose = require('mongoose');

const testSuiteSchema = mongoose.Schema(
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
      default: 0
    },
    creator: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
      trim: true
    },
    modifiedBy: {
      type: String,
      maxlength: 100,
      minlength: 5,
      trim: true
    },
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BaseTestCase' }],
    scheduledTest: [{ type: mongoose.Schema.Types.ObjectId }],
    // scheduledTest: [String],
    relatedProblems: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

const TestSuite = mongoose.model('TestSuite', testSuiteSchema);

module.exports = TestSuite;
