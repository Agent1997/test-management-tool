const cleanReqBody = (req, acceptedParams) => {
  if (acceptedParams.length > 0) {
    const currentReqParams = Object.keys(req.body);
    currentReqParams.forEach(value => {
      if (!acceptedParams.includes(value)) {
        delete req.body[value];
      }
    });
  }
};

module.exports = (req, res, next) => {
  let acceptedParams = [];
  //   console.log('before', req.body);
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
      break;
    }
  }

  cleanReqBody(req, acceptedParams);
  //   console.log('after', req.body);
  next();
};
