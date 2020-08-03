const express = require('express');
const scheduledTestCaseController = require('./../controllers/scheduledTestCaseController');

const router = express.Router();

router
  .route('/:scheduledTCID')
  .patch(scheduledTestCaseController.updateScheduledTestCase);

module.exports = router;
