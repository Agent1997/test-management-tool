const mongoose = require('mongoose');
const AppError = require('./appError');

module.exports = obj => {
  let testID;
  try {
    testID = new mongoose.Types.ObjectId(obj);
  } catch (err) {
    throw new AppError(`${obj} is not a valid mongoose object id`, 400);
  }

  //Had to use soft inequality due to testID is an object ant obj is string
  // eslint-disable-next-line eqeqeq
  if (testID != obj) {
    throw new AppError(`${obj} is not a valid mongoose object id`, 400);
  }
};
