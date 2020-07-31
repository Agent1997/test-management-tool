const express = require('express');
const baseTestCasesController = require('./../controllers/baseTestCaseController');

const router = express.Router();

router
  .route('/:tsID')
  // .post(testCasesController.createTestCases)
  .get(baseTestCasesController.getAllTestCase);

router.route('/').post(baseTestCasesController.createTestCases);

router
  .route('/:tsID/:id')
  .get(baseTestCasesController.getTestCase)
  .patch(baseTestCasesController.updateTestCase)
  .delete(baseTestCasesController.deleteTestCase);

module.exports = router;
