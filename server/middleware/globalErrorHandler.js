module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode || 500).json({
    success: err.status,
    message: err.message || "Internal Server Error",
  });
};
