const TestCase = require('./../models/testCaseModel');

exports.createTestCases = async (req, res) => {
  const testCase = await TestCase.create(req.body);

  res.status(201).json({
    status: 'success',
    data: testCase
  });
};
