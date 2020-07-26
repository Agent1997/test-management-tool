const express = require('express');
const testCasesController = require('./../controllers/testCasesController');

const router = express.Router();

router
  .route('/:tsID')
  // .post(testCasesController.createTestCases)
  .get(testCasesController.getAllTestCase)
  .post(testCasesController.createTestCases);

router
  .route('/:tsID/:id')
  .get(testCasesController.getTestCase)
  .patch(testCasesController.updateTestCase)
  .delete(testCasesController.deleteTestCase);

module.exports = router;
