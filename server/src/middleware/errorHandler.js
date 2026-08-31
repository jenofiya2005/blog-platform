const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  if (err.code === 'P2002') {
    return res.status(400).json({
      message: 'A unique constraint was violated. A record with this value already exists.'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found in the database.'
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
