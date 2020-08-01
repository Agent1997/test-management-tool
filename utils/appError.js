class AppError extends Error {
  constructor(message, statusCode, originalErr = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.originalError = originalErr;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
