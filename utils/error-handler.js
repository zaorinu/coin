module.exports = function errorHandler(err, req, res, next) {
  // minimal centralized error handler for production
  // eslint-disable-next-line no-console
  console.error(err && err.stack ? err.stack : err);

  if (res.headersSent) return next(err);

  const status = err && err.status ? err.status : 500;
  res.status(status).json({ success: false, error: err && err.message ? err.message : 'Internal Server Error' });
};
