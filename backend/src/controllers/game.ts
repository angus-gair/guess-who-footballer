import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

/**
 * @route POST /api/games
 * @desc Create a new game
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with GameService
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Create game endpoint',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/games/:id
 * @desc Get game details by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with GameService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Get game details endpoint',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/games/join/:code
 * @desc Join game by room code
 */
router.get('/join/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement with GameService
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Join game endpoint',
    });
  } catch (error) {
    next(error);
  }
});

export default router; 