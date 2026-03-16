export const createHttpError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

export const badRequestError = (message) => (
  createHttpError(400, message)
)

export const notFoundError = (message) => (
  createHttpError(404, message)
)

export const internalServerError = (message = "Internal Server Error") => (
  createHttpError(500, message)
)
