import { Server, Socket } from 'socket.io';
import { clientEvents, serverEvents } from './events';
import logger from '../utils/logger';

/**
 * Register event handlers for socket.io
 * @param io Socket.IO server instance
 * @param socket Socket connection
 */
const registerEventHandlers = (io: Server, socket: Socket): void => {
  // Join room event
  socket.on(clientEvents.JOIN_ROOM, async (data) => {
    try {
      const { roomCode, displayName } = data;
      logger.info(`Player ${displayName} joining room ${roomCode}`);

      // TODO: Implement with GameService
      // Join the room
      socket.join(roomCode);

      // Emit success event
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: `${displayName} joined the room`,
      });

    } catch (error) {
      logger.error(`Error in JOIN_ROOM: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to join room',
      });
    }
  });

  // Leave room event
  socket.on(clientEvents.LEAVE_ROOM, async (data) => {
    try {
      const { roomCode } = data;
      logger.info(`Player leaving room ${roomCode}`);

      // TODO: Implement with GameService
      // Leave the room
      socket.leave(roomCode);

      // Emit event to remaining players
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: 'A player left the room',
      });

    } catch (error) {
      logger.error(`Error in LEAVE_ROOM: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to leave room',
      });
    }
  });

  // Ask question event
  socket.on(clientEvents.ASK_QUESTION, async (data) => {
    try {
      const { roomCode, questionId } = data;
      logger.info(`Question asked in room ${roomCode}: ${questionId}`);

      // TODO: Implement with GameService

      // Emit events to players
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: 'Question asked',
      });

    } catch (error) {
      logger.error(`Error in ASK_QUESTION: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to process question',
      });
    }
  });

  // Answer question event
  socket.on(clientEvents.ANSWER_QUESTION, async (data) => {
    try {
      const { roomCode, answer } = data;
      logger.info(`Question answered in room ${roomCode}: ${answer}`);

      // TODO: Implement with GameService

      // Emit events to players
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: 'Question answered',
      });

    } catch (error) {
      logger.error(`Error in ANSWER_QUESTION: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to process answer',
      });
    }
  });

  // Make guess event
  socket.on(clientEvents.MAKE_GUESS, async (data) => {
    try {
      const { roomCode, footballerId } = data;
      logger.info(`Guess made in room ${roomCode}: ${footballerId}`);

      // TODO: Implement with GameService

      // Emit events to players
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: 'Guess made',
      });

    } catch (error) {
      logger.error(`Error in MAKE_GUESS: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to process guess',
      });
    }
  });

  // Request rematch event
  socket.on(clientEvents.REQUEST_REMATCH, async (data) => {
    try {
      const { roomCode } = data;
      logger.info(`Rematch requested in room ${roomCode}`);

      // TODO: Implement with GameService

      // Emit events to players
      io.to(roomCode).emit(serverEvents.GAME_STATE_UPDATE, {
        message: 'Rematch requested',
      });

    } catch (error) {
      logger.error(`Error in REQUEST_REMATCH: ${error instanceof Error ? error.message : String(error)}`);
      socket.emit(serverEvents.ERROR, {
        message: 'Failed to request rematch',
      });
    }
  });
};

export default registerEventHandlers; 