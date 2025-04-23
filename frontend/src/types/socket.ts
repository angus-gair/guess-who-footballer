import { Footballer, GameRoom, PlayerSession, Question, TurnRecord } from './game';

// Socket Event Types
export enum SocketEvent {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  RECONNECT = 'reconnect',
  
  // Room events
  CREATE_ROOM = 'createRoom',
  JOIN_ROOM = 'joinRoom',
  LEAVE_ROOM = 'leaveRoom',
  ROOM_CREATED = 'roomCreated',
  ROOM_JOINED = 'roomJoined',
  PLAYER_JOINED = 'playerJoined',
  PLAYER_LEFT = 'playerLeft',
  
  // Game events
  GAME_STARTED = 'gameStarted',
  GAME_STATE_UPDATE = 'gameStateUpdate',
  TURN_CHANGE = 'turnChange',
  
  // Question events
  ASK_QUESTION = 'askQuestion',
  QUESTION_ASKED = 'questionAsked',
  ANSWER_QUESTION = 'answerQuestion',
  QUESTION_ANSWERED = 'questionAnswered',
  
  // Guess events
  MAKE_GUESS = 'makeGuess',
  GUESS_MADE = 'guessMade',
  GUESS_RESULT = 'guessResult',
  
  // Card events
  CARD_ELIMINATION = 'cardElimination',
  
  // Game over events
  GAME_OVER = 'gameOver',
  REQUEST_REMATCH = 'requestRematch',
  REMATCH_REQUESTED = 'rematchRequested',
  REMATCH_ACCEPTED = 'rematchAccepted',
  
  // Error events
  ERROR = 'error'
}

// Socket Payload Types
export interface RoomCreatedPayload {
  roomId: string;
  gameRoom: GameRoom;
}

export interface RoomJoinedPayload {
  roomId: string;
  gameRoom: GameRoom;
  player: PlayerSession;
}

export interface PlayerJoinedPayload {
  player: PlayerSession;
  gameRoom: GameRoom;
}

export interface PlayerLeftPayload {
  playerId: string;
  gameRoom: GameRoom;
}

export interface GameStartedPayload {
  gameRoom: GameRoom;
  availableQuestions: Question[];
  footballers: Footballer[];
}

export interface GameStateUpdatePayload {
  gameRoom: GameRoom;
}

export interface TurnChangePayload {
  playerId: string;
  remainingTime: number | null;
}

export interface QuestionAskedPayload {
  playerId: string;
  question: Question;
  turnRecord: TurnRecord;
}

export interface QuestionAnsweredPayload {
  playerId: string;
  questionId: string;
  answer: boolean;
  eliminatedIds: string[];
}

export interface GuessMadePayload {
  playerId: string;
  footballerId: string;
  turnRecord: TurnRecord;
}

export interface GuessResultPayload {
  isCorrect: boolean;
  secretFootballer: Footballer;
  winnerId: string | null;
}

export interface CardEliminationPayload {
  playerId: string;
  eliminatedIds: string[];
}

export interface GameOverPayload {
  winnerId: string;
  reason: 'correct_guess' | 'incorrect_guess' | 'out_of_questions' | 'player_left';
  secretFootballer: Footballer;
  gameStats: {
    totalTurns: number;
    duration: number;
    questionCount: number;
  };
}

export interface RematchRequestedPayload {
  playerId: string;
  wantsRematch: boolean;
}

export interface RematchAcceptedPayload {
  gameRoom: GameRoom;
}

export interface ErrorPayload {
  code: string;
  message: string;
} 