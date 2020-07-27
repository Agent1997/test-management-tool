const ScheduledTest = require('./../models/scheduledTestModel');
const TestSuite = require('./../models/testSuiteModel');

exports.scheduleTest = async (req, res) => {
  try {
    const testCasesObj = await TestSuite.findById(req.body.tsID).select(
      'testCases title _id'
    );

    const { testCases, title, _id } = testCasesObj;
    const testCaseArr = testCases.map(tcID => {
      return { tcID };
    });
    const { body } = req;
    body.testCases = testCaseArr;
    body.title = title;
    body.testSuiteID = _id;
    const query = ScheduledTest.create(body);

    const scheduledTest = await query;

    res.status(200).json({
      status: 'success',
      data: scheduledTest
    });
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};
