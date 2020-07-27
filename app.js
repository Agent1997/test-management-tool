const express = require('express');

const testCasesRouter = require('./routes/testCasesRouter');
const testSuitesRouter = require('./routes/testSuitesRouter');
const scheduledTestRouter = require('./routes/scheduledTestRouter');

const app = express();

app.use(express.json());

app.use('/api/v1/test-cases', testCasesRouter);
app.use('/api/v1/test-suites', testSuitesRouter);
app.use('/api/v1/scheduled-tests', scheduledTestRouter);

module.exports = app;
