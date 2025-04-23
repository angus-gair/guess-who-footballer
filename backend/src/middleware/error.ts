import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
}

// Error handler middleware
const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  // Log the error
  logger.error(`[${statusCode}] ${message}`);
  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler; 