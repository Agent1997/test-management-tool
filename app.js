const express = require('express');

const baseTestCasesRouter = require('./routes/baseTestCaseRouter');
const testSuitesRouter = require('./routes/testSuitesRouter');
const viewRouter = require('./routes/viewRouter');
const scheduledTestCasesRouter = require('./routes/scheduledTestCaseRouter');
const scheduledTestSuitesRouter = require('./routes/scheduledTestSuitesRouter');
const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./utils/appError');
const requestBodyFilter = require('./utils/requestBodyFilter');

const app = express();

app.use(express.json());
app.use(requestBodyFilter);

app.use('/api/v1/test-cases', baseTestCasesRouter);
app.use('/api/v1/test-suites', testSuitesRouter);
app.use('/api/v1/scheduled-testSuites', scheduledTestSuitesRouter);
app.use('/api/v1/scheduled-testCases', scheduledTestCasesRouter);
app.use('/', viewRouter);

//Handling other routes
app.all('*', (req, res, next) => {
  next(new AppError(`URL ${req.originalUrl} does not exists`, 404));
});

//Middleware for handling errors
app.use(globalErrorHandler);

module.exports = app;
