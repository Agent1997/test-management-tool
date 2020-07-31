const express = require('express');
const scheduledTestSuitesController = require('../controllers/scheduledTestSuitesController');

const router = express.Router();

router.route('/').post(scheduledTestSuitesController.scheduleTest);

module.exports = router;
