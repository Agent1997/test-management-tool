const express = require('express');
const scheduledTestSuitesController = require('../controllers/scheduledTestSuitesController');

const router = express.Router();

router
  .route('/')
  .post(scheduledTestSuitesController.scheduleTest)
  .patch(scheduledTestSuitesController.updateScheduledTestSuite)
  .delete(scheduledTestSuitesController.deleteScheduledTestSuite);

router.route('/:scheduledTestSuiteID');

module.exports = router;
