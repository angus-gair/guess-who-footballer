import { Router } from 'express';
import authRoutes from './auth';
import gameRoutes from './game';
import footballerRoutes from './footballer';
import questionRoutes from './question';

const router = Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/footballers', footballerRoutes);
router.use('/questions', questionRoutes);

export default router; 