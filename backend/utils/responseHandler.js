/**
 * Response helper functions for standard REST API format
 */

const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const errorResponse = (res, message, statusCode = 400, details = null) => {
  const response = {
    success: false,
    error: message,
  };
  if (details) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
