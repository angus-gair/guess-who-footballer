// Game Enums
export enum GameMode {
  SINGLE_PLAYER = 'SP',
  MULTI_PLAYER = 'MP'
}

export enum GameState {
  WAITING = 'waiting',
  IN_PROGRESS = 'in-progress',
  FINISHED = 'finished'
}

export enum GameSubState {
  WAITING_FOR_ANSWER = 'waitingForAnswer',
  PENDING_REMATCH = 'pendingRematch'
}

export enum FootballerPosition {
  GOALKEEPER = 'GK',
  DEFENDER = 'DEF',
  MIDFIELDER = 'MID',
  FORWARD = 'FWD'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Core Entities
export interface Footballer {
  id: string;
  name: string;
  image: string;
  club: string;
  nation: string;
  position: FootballerPosition;
  ageBracket: string;
  hairColor: string;
  facialHair: string;
  bootsColor: string;
  // Other traits as needed
}

export interface PlayerSession {
  sessionId: string;
  socketId: string;
  displayName: string;
  isHuman: boolean;
  secretId: string; // FK to Footballer
  eliminatedIds: string[];
  remainingQuestions: number;
  isTurn: boolean;
  lastActive: Date;
  wantsRematch: boolean;
  askedQuestions: string[]; // Array of question IDs
}

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  players: PlayerSession[];
  state: GameState;
  subState?: GameSubState;
  turnHistory: TurnRecord[];
  startedAt: Date;
  winnerId?: string;
  settings: {
    turnTimeLimit: number | null;
    maxQuestions: number;
    difficulty: Difficulty;
  };
}

export interface Question {
  id: string;
  text: string;
  trait: keyof Footballer;
  expectedValues: string[];
}

export interface TurnRecord {
  playerId: string;
  questionId?: string;
  guessId?: string;
  isCorrect?: boolean;
  timestamp: Date;
}

export interface GameStatistic {
  id: string;
  gameRoomId: string;
  totalTurns: number;
  questionCount: number;
  duration: number;
  winnerId: string;
  createdAt: Date;
}

// API Request and Response Types
export interface CreateGameRequest {
  mode: GameMode;
  displayName: string;
  settings: {
    turnTimeLimit: number | null;
    maxQuestions: number;
    difficulty: Difficulty;
  };
}

export interface JoinGameRequest {
  roomId: string;
  displayName: string;
}

export interface AskQuestionRequest {
  roomId: string;
  questionId: string;
}

export interface AnswerQuestionRequest {
  roomId: string;
  answer: boolean;
}

export interface MakeGuessRequest {
  roomId: string;
  footballerId: string;
}

export interface RematchRequest {
  roomId: string;
  wantsRematch: boolean;
} 