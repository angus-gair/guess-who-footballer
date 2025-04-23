import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @route GET /api/questions
 * @desc Get all questions with optional filtering by category
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with QuestionService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Get questions endpoint',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/questions/:id
 * @desc Get question by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with QuestionService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Get question by ID endpoint',
    });
  } catch (error) {
    next(error);
  }
});

export default router; 