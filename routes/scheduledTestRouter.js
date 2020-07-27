const express = require('express');
const scheduledTestController = require('./../controllers/scheduledTestsController');

const router = express.Router();

router.route('/').post(scheduledTestController.scheduleTest);

module.exports = router;
