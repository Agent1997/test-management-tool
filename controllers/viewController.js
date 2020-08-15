const mainHTML = require('./../views/mainHTML');
const testSuiteHTML = require('./../views/testSuiteHTML');

exports.getHome = (req, res, next) => {
  // const loc = `views/index.html`;
  // const path = __dirname.replace('controllers', loc);
  // res.sendFile(path);
  const html = mainHTML().replace('%TEST_SUITE%', testSuiteHTML());

  res.type('text/html');
  res.send(html);
};
