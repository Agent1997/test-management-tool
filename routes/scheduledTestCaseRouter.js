const express = require('express');
const scheduledTestCaseController = require('./../controllers/scheduledTestCaseController');

const router = express.Router();

router
  .route('/:scheduledTestCaseID')
  .patch(scheduledTestCaseController.updateScheduledTestCase);

router
  .route('/:scheduledTestSuiteID/:scheduledTestCaseID')
  .delete(scheduledTestCaseController.deleteScheduledTestCase);
module.exports = router;
