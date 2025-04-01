const handleApiError = (error, res, message) => {
  if (error.response) {
    return res.status(401).json({
      status: "failed",
      valid: false,
      message: "Invalid API credentials",
      error: error.response.data
    });
  }
  
  return res.status(500).json({
    status: "error",
    valid: false,
    message: message,
    error: error.message
  });
}

module.exports = { handleApiError };