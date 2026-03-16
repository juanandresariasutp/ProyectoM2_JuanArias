const errorHandler = (err, req, res, next) => {
  console.error(err)

  const statusCode = err.statusCode || 500
  const message = statusCode === 500
    ? "Internal Server Error"
    : err.message

  res.status(statusCode).json({
    error: message
  })
}

export default errorHandler
