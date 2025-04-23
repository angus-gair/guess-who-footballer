// Game related models and types
import { Question } from './question';
import { Footballer } from './footballer';
import { 
  GameMode, 
  GameState, 
  GameSubState, 
  TurnType,
  Difficulty 
} from './game-enums';

export interface GameSettings {
  turnTimeLimit: number | null;
  maxQuestions: number;
  difficulty: Difficulty;
}

export interface PlayerSession {
  id: string;
  displayName: string;
  isHuman: boolean;
  isTurn: boolean;
  lastActive: Date;
  wantsRematch: boolean;
  remainingGuesses: number;
  userId?: string;
  secretId: string;
  eliminatedFootballers: Footballer[];
  askedQuestions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TurnRecord {
  id: string;
  playerSessionId: string;
  questionId?: string;
  guessId?: string;
  answer?: boolean;
  turnType: TurnType;
  timestamp: Date;
}

export interface GameRoom {
  id: string;
  roomCode: string;
  mode: GameMode;
  state: GameState;
  subState?: GameSubState;
  players: PlayerSession[];
  turnHistory: TurnRecord[];
  startedAt?: Date;
  endedAt?: Date;
  winnerId?: string;
  settings: GameSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStatistic {
  id: string;
  totalTurns: number;
  questionCount: number;
  duration: number;
  createdAt: Date;
  gameRoomId: string;
  winnerId?: string;
}

// Game status enum
export enum GameStatus {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  SELECTION = 'SELECTION',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

// Event types for game events
export enum EventType {
  GAME_CREATED = 'GAME_CREATED',
  PLAYER_JOINED = 'PLAYER_JOINED',
  FOOTBALLER_SELECTED = 'FOOTBALLER_SELECTED',
  QUESTION_ASKED = 'QUESTION_ASKED',
  QUESTION_ANSWERED = 'QUESTION_ANSWERED',
  FOOTBALLER_ELIMINATED = 'FOOTBALLER_ELIMINATED',
  GUESS_MADE = 'GUESS_MADE',
  GAME_WON = 'GAME_WON',
  GAME_DRAW = 'GAME_DRAW'
}

// Player model
export interface Player {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerInGame {
  playerId: string;
  selectedFootballerId?: string;
  availableFootballers: string[]; // IDs of footballers still in play
  eliminatedFootballers: string[]; // IDs of footballers eliminated
  joinedAt: Date;
}

// Question model
export interface Question {
  id: string;
  gameId: string;
  questionText: string;
  askedByPlayerId: string;
  answeredByPlayerId?: string;
  answer?: boolean;
  askedAt: Date;
  answeredAt?: Date;
}

// Game event model
export interface GameEvent {
  id: string;
  gameId: string;
  type: EventType;
  playerId: string;
  data?: any; // Additional data relevant to the event
  timestamp: Date;
}

// Game model
export interface Game {
  id: string;
  status: GameStatus;
  players: PlayerInGame[];
  currentTurn: {
    playerId: string;
    type: TurnType;
  };
  footballers: string[]; // IDs of all footballers in the game
  events: GameEvent[];
  winner?: string; // Player ID of the winner
  createdAt: Date;
  updatedAt: Date;
  finishedAt?: Date;
} 