const express = require('express');

const testCasesRouter = require('./routes/testCasesRouter');
const testSuitesRouter = require('./routes/testSuitesRouter');

const app = express();

app.use(express.json());

app.use('/api/v1/test-cases', testCasesRouter);
app.use('/api/v1/test-suites', testSuitesRouter);

module.exports = app;
