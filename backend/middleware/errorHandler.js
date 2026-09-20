const multer = require('multer');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err.message || err);

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Maximum file size allowed is 10 MB.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  // Handle custom application errors
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
