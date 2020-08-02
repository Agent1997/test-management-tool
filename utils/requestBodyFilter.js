const cleanObject = require('./cleanObject');

module.exports = (req, res, next) => {
  let acceptedParams = [];
  // eslint-disable-next-line default-case
  switch (req.method) {
    case 'POST': {
      if (req.originalUrl === '/api/v1/test-suites') {
        acceptedParams = ['title', 'creator'];
      }
      if (req.originalUrl === '/api/v1/test-cases') {
        acceptedParams = [
          'testSuiteID',
          'title',
          'creator',
          'preRequisites',
          'testSteps',
          'testData',
          'postConditions',
          'expectedResults',
          'priority'
        ];
      }
      if (req.originalUrl === '/api/v1/scheduled-tests') {
        acceptedParams = [
          'testSuiteID',
          'milestone',
          'type',
          'scheduledBy',
          'priority'
        ];
      }
      break;
    }
  }

  cleanObject(req.body, acceptedParams);
  //   console.log('after', req.body);
  next();
};
