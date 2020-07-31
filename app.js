const express = require('express');

const baseTestCasesRouter = require('./routes/baseTestCaseRouter');
const testSuitesRouter = require('./routes/testSuitesRouter');
const scheduledTestSuitesRouter = require('./routes/scheduledTestSuitesRouter');
const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

app.use('/api/v1/test-cases', baseTestCasesRouter);
app.use('/api/v1/test-suites', testSuitesRouter);
app.use('/api/v1/scheduled-tests', scheduledTestSuitesRouter);

//Handling other routes
app.all('*', (req, res, next) => {
  next(new AppError(`URL ${req.originalUrl} does not exists`, 404));
});

//Middleware for handling errors
app.use(globalErrorHandler);

module.exports = app;
