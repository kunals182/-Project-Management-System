function errorHandler(err, req, res, next) {
  const status  = err.status || 500;
  const message = status === 500
    ? 'An unexpected error occurred. Please try again later.'
    : err.message;

  if (status === 500) {
    console.error('[Server Error]', err.stack || err.message);
  }

  res.status(status).json({
    error  : status === 500 ? 'Internal Server Error' : 'Error',
    message,
  });
}

module.exports = errorHandler;
