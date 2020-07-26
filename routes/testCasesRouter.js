const express = require('express');
const testCasesController = require('./../controllers/testCasesController');

const router = express.Router();

router
  .route('/')
  .post(testCasesController.createTestCases)
  .get(testCasesController.getAllTestCase);

router
  .route('/:id')
  .get(testCasesController.getTestCase)
  .patch(testCasesController.updateTestCase)
  .delete(testCasesController.deleteTestCase);

module.exports = router;
