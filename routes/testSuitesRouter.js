const express = require('express');
const testSuitesController = require('./../controllers/testSuitesController');

const router = express.Router();

router
  .route('/')
  .post(testSuitesController.createTestSuite)
  .get(testSuitesController.getAllTestSuites);

router
  .route('/:id')
  .patch(testSuitesController.updateTestSuite)
  .get(testSuitesController.getTestSuite)
  .delete(testSuitesController.deleteTestSuite);

module.exports = router;
