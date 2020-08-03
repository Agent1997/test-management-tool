const ScheduledTestCasesModel = require('./../models/scheduledTestCasesModel');
const catchAsync = require('./../utils/catchAsync');

exports.updateScheduledTestCase = catchAsync(async (req, res, next) => {
  const query = ScheduledTestCasesModel.findByIdAndUpdate(
    req.params.scheduledTCID,
    req.body,
    {
      new: true
    }
  );

  const scheduledTC = await query;
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    data: { scheduledTestCase: scheduledTC }
  });
});
