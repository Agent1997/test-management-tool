const AppError = require('./../utils/appError');

const castErrorHandlerDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, err);
};

const validationErrorHandlerDB = err => {
  const errors = Object.values(err.errors).map(el => el.properties.message);
  const message = `Invalid values. ${errors.join(' ')}`;
  return new AppError(message, 400, err);
};

const sendErrorDev = (err, res) => {
  // console.log('im in error controller');
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,

      //remove below codes later
      stack: err.stack,
      error: err
    });
  } else {
    // console.error('ERROR ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',

      //remove below codes later
      stack: err.stack,
      error: err
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  // const errName = err.stack.split(':')[0].toLowerCase();
  // console.log(errName);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.stack.split(':')[0].toLowerCase() === 'casterror') {
      error = castErrorHandlerDB(err);
    }
    if (err.stack.split(':')[0].toLowerCase() === 'validationerror') {
      error = validationErrorHandlerDB(err);
    }
    sendErrorProd(error, res);
  }
};
