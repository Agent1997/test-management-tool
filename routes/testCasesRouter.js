const express = require('express');
const testCasesController = require('./../controllers/testCasesController');

const router = express.Router();

router.route('/').post(testCasesController.createTestCases);
module.exports = router;
