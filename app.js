const express = require('express');

const testCasesRouter = require('./routes/testCasesRouter');

const app = express();

app.use(express.json());

app.use('/api/v1/test-cases', testCasesRouter);
module.exports = app;
