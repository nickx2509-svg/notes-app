import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // If error is not ApiError
  if (!(err instanceof ApiError)) {
    console.error("UNEXPECTED ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

export { errorHandler };
