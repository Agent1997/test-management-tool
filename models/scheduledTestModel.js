const mongoose = require('mongoose');

const sheduledTestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 500,
      minlength: 5,
      trim: true
    },
    version: {
      type: Number,
      max: 100,
      default: 0
    },
    status: {
      type: [String],
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
      default: 5
    }
  },
  {
    timestamps: true
  }
);

const ScheduledTest = mongoose.model('ScheduledTest', sheduledTestSchema);

module.exports = ScheduledTest;
