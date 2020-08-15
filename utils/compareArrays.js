module.exports = (arrObj, arrStr) => {
  const present = [];
  const notPresent = [];
  //   const arrStrIDs = arrStr.map(el => mongoose.Types.ObjectId(el));
  const arrObjIDs = arrObj.map(el => el._id.toString());
  arrStr.forEach(el => {
    if (arrObjIDs.includes(el)) {
      if (!present.includes(el)) {
        present.push(el);
      }
    } else if (!notPresent.includes(el)) {
      notPresent.push(el);
    }
  });

  return { present, notPresent };
};
