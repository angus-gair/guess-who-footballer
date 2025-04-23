// Game enum types

export enum GameMode {
  SP = 'SP', // Single Player
  MP = 'MP', // Multiplayer
}

export enum GameState {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum GameSubState {
  WAITING_FOR_ANSWER = 'WAITING_FOR_ANSWER',
  PENDING_REMATCH = 'PENDING_REMATCH',
}

export enum TurnType {
  QUESTION = 'QUESTION',
  GUESS = 'GUESS',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
} 