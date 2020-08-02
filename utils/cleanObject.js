module.exports = (obj, acceptedObjKeys) => {
  if (acceptedObjKeys.length > 0) {
    const currentReqParams = Object.keys(obj);
    currentReqParams.forEach(value => {
      if (!acceptedObjKeys.includes(value)) {
        delete obj[value];
      }
    });
  }
};
