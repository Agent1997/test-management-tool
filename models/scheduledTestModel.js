const mongoose = require('mongoose');
const TestSuite = require('./testSuiteModel');

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
      required: true
    },
    version: {
      type: Number,
      max: 100,
      default: 0
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
    relatedProblems: [{ type: mongoose.Schema.Types.ObjectId }],
    attachedImages: {
      type: [String]
    },
    attachedFiles: {
      type: [String]
    },
    testCases: [
      {
        tcID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        _id: false,
        tcStatus: {
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
        }
      }
    ],
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

scheduledTestSchema.post('save', async function() {
  try {
    const testSuite = await TestSuite.findById(this.testSuiteID);
    testSuite.scheduledTest.push(this._id);
    await TestSuite.findByIdAndUpdate(this.testSuiteID, {
      scheduledTest: testSuite.scheduledTest
    });
  } catch (err) {
    console.log(err);
  }
});

const ScheduledTest = mongoose.model('ScheduledTest', scheduledTestSchema);

module.exports = ScheduledTest;
