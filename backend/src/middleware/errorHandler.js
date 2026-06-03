function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.statusCode || 500;
  const message = err.publicMessage || err.message || 'Internal Server Error';

  res.status(status).json({
    error: message
  });
}

module.exports = { errorHandler };

