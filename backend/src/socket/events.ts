// Socket.IO event constants

// Standard Socket.IO events
export const socketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
};

// Client to Server events
export const clientEvents = {
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  ASK_QUESTION: 'ASK_QUESTION',
  ANSWER_QUESTION: 'ANSWER_QUESTION',
  MAKE_GUESS: 'MAKE_GUESS',
  REQUEST_REMATCH: 'REQUEST_REMATCH',
};

// Server to Client events
export const serverEvents = {
  GAME_STATE_UPDATE: 'GAME_STATE_UPDATE',
  TURN_CHANGE: 'TURN_CHANGE',
  CARD_ELIMINATION: 'CARD_ELIMINATION',
  GAME_OVER: 'GAME_OVER',
  ERROR: 'ERROR',
  RECONNECT_SUCCESS: 'RECONNECT_SUCCESS',
}; 