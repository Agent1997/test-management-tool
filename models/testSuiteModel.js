const mongoose = require('mongoose');
const TestCase = require('./testCaseModel');

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
      // status are not yet final
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
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }],
    scheduledTest: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

const TestSuite = mongoose.model('TestSuite', testSuiteSchema);

module.exports = TestSuite;
