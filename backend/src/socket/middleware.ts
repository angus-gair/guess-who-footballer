import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import { socketEvents } from './events';

/**
 * Register Socket.IO middleware
 * @param io Socket.IO server instance
 */
const registerMiddleware = (io: Server): void => {
  // Error handling middleware
  io.use((socket: Socket, next) => {
    socket.on(socketEvents.ERROR, (err) => {
      logger.error(`Socket error (${socket.id}): ${err.message}`);
    });
    next();
  });

  // TODO: Add JWT authentication middleware when implementing auth
  /*
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }
    
    try {
      // Verify JWT token (will be implemented with auth)
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // socket.data.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });
  */
};

export default registerMiddleware; 