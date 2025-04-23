import { StatusCodes } from 'http-status-codes';

// Base error class
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

// Bad request error
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

// Unauthorized error
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

// Forbidden error
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN);
  }
}

// Conflict error
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, StatusCodes.CONFLICT);
  }
}

// Internal server error
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
} 