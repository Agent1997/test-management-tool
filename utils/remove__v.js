module.exports = obj => {
  if (Array.isArray(obj)) {
    obj.forEach(testCase => {
      testCase.__v = undefined;
    });
  } else {
    obj.__v = undefined;
  }
};
