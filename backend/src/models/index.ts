// Export all model types from this file
export * from './user';
export * from './footballer';
export * from './game-enums';
export * from './game';
export * from './game-requests';
export * from './question';

export interface Player {
  id: string;
  name: string;
  team: string;
  nationality: string;
  position: string;
  imageUrl: string;
  attributes: Record<string, string | boolean>; // Flexible attributes
}

export interface Question {
  id: string;
  text: string;
  attribute: string;
  value: string;
  type: 'boolean' | 'specific';
}

export enum GameStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum GameMode {
  SINGLE_PLAYER = 'single_player',
  MULTIPLAYER = 'multiplayer',
}

export interface Game {
  id: string;
  status: GameStatus;
  mode: GameMode;
  createdAt: Date;
  updatedAt: Date;
  players: Player[]; // All available players
  questions: Question[]; // All available questions
  
  // Game state
  currentTurn: string; // 'player' or 'ai' or player ID in multiplayer
  selectedPlayerId?: string; // The secret player to guess
  remainingQuestions: string[]; // IDs of questions not yet asked
  playerBoard: Record<string, boolean>; // Map of player IDs to visibility (true = visible/not eliminated)
  aiBoard?: Record<string, boolean>; // AI's board state in single player
  history: GameEvent[]; // History of game events
  winner?: string; // ID of winner if game completed
}

export interface GameEvent {
  id: string;
  gameId: string;
  type: 'question' | 'guess';
  playerId: string; // Who performed the action
  timestamp: Date;
  data: {
    questionId?: string;
    answer?: boolean;
    guessedPlayerId?: string;
    correct?: boolean;
  };
}

export interface GameState {
  game: Game;
  player: {
    id: string;
    board: Record<string, boolean>;
    askedQuestions: string[];
    remainingGuesses: number;
  };
  opponent?: {
    id: string;
    board: Record<string, boolean>;
    askedQuestions: string[];
    remainingGuesses: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    winRate: number;
  };
} 