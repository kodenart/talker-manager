const errorHandler = (err, req, res, _next) => {
  res.status(500).json({ error: err.message });
};

module.exports = { errorHandler };