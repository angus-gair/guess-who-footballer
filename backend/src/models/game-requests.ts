// Game request and response types
import { Question } from './question';
import { Footballer } from './footballer';
import { 
  GameMode, 
  GameState, 
  GameSubState, 
  TurnType
} from './game-enums';
import { GameSettings } from './game';

// Request types
export interface CreateGameRequest {
  mode: GameMode;
  displayName: string;
  settings?: Partial<GameSettings>;
}

export interface JoinGameRequest {
  displayName: string;
}

export interface AskQuestionRequest {
  questionId: string;
}

export interface AnswerQuestionRequest {
  answer: boolean;
}

export interface MakeGuessRequest {
  footballerId: string;
}

// Response types
export interface GameStateResponse {
  id: string;
  roomCode: string;
  mode: GameMode;
  state: GameState;
  subState?: GameSubState;
  currentTurn?: string;
  players: PlayerSessionResponse[];
  turnHistory: TurnRecordResponse[];
  startedAt?: Date;
  endedAt?: Date;
  winnerId?: string;
  settings: GameSettings;
}

export interface PlayerSessionResponse {
  id: string;
  displayName: string;
  isHuman: boolean;
  isTurn: boolean;
  lastActive: Date;
  eliminatedIds: string[];
  askedQuestionIds: string[];
  remainingGuesses: number;
}

export interface TurnRecordResponse {
  id: string;
  playerSessionId: string;
  question?: Question;
  guess?: Footballer;
  answer?: boolean;
  turnType: TurnType;
  timestamp: Date;
} 