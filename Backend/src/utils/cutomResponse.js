export const successResponse = (res, status = 200, message = "Successful", data = null) => {
  return res.status(status).json({
    success: true,
    message,
    status,
    data
  })
}

// export const errorResponse = (res, status = 500, message = "Server error", data) => {
//   return res.status(status).json({
//     success: false,
//     message,
//     status,
//     data
//   })
// }

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  console.log("error handler: ", err)
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode || 500,
    message: err.message || "Something went wrong.",
  });
};