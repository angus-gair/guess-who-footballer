import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @route GET /api/footballers
 * @desc Get footballer list with optional filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with FootballerService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Get footballers endpoint',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/footballers/:id
 * @desc Get footballer by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with FootballerService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Get footballer by ID endpoint',
    });
  } catch (error) {
    next(error);
  }
});

export default router; 