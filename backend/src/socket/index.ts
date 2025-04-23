import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import registerEventHandlers from './handlers';
import registerMiddleware from './middleware';
import { socketEvents } from './events';

let io: Server;

/**
 * Initialize Socket.IO server
 * @param server HTTP server instance
 */
export const setupSocketIO = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://who.gair.com.au',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Apply middleware
  registerMiddleware(io);

  // Handle connection events
  io.on(socketEvents.CONNECTION, (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Register event handlers
    registerEventHandlers(io, socket);

    // Handle disconnection
    socket.on(socketEvents.DISCONNECT, (reason) => {
      logger.info(`Client disconnected: ${socket.id} - Reason: ${reason}`);
      // Cleanup will be handled in handlers.ts
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

/**
 * Get Socket.IO server instance
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}; 