import { v4 as uuidv4 } from 'uuid';
import { Game, Player, Question, GameStatus, GameMode, GameEvent, GameState, User } from '../models';

/**
 * Creates a new game with the given parameters
 */
export function createGame(hostUser: User, gameMode: GameMode, players: Player[]): Game {
  const hostPlayerIndex = Math.floor(Math.random() * players.length);
  const hostPlayer = players[hostPlayerIndex];
  
  // Select random player for opponent (AI or 2nd player)
  const opponentPlayerIndex = (hostPlayerIndex + Math.floor(Math.random() * (players.length - 1)) + 1) % players.length;
  const opponentPlayer = players[opponentPlayerIndex];
  
  const game: Game = {
    id: uuidv4(),
    status: GameStatus.WAITING,
    mode: gameMode,
    hostId: hostUser.id,
    guestId: null,
    hostSelectedPlayer: hostPlayer,
    guestSelectedPlayer: opponentPlayer,
    availablePlayers: players,
    currentTurn: hostUser.id,
    turnCount: 0,
    winner: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [],
  };
  
  return game;
}

/**
 * Creates a new game event
 */
export function createGameEvent(
  gameId: string, 
  playerId: string, 
  eventType: string, 
  data: any
): GameEvent {
  return {
    id: uuidv4(),
    gameId,
    playerId,
    eventType,
    data,
    timestamp: new Date()
  };
}

/**
 * Check if a player's question eliminates the opponent's selected player
 */
export function checkQuestion(question: Question, player: Player): boolean {
  // Simple attribute check
  if (question.attributeType && question.attributeValue) {
    return player.attributes[question.attributeType] === question.attributeValue;
  }
  
  // Property check
  if (question.property && question.value) {
    return player[question.property] === question.value;
  }
  
  return false;
}

/**
 * Filter available players based on a question
 */
export function filterPlayers(players: Player[], question: Question, result: boolean): Player[] {
  return players.filter(player => {
    const matches = checkQuestion(question, player);
    return result ? matches : !matches;
  });
}

/**
 * Get the current game state for a specific player
 */
export function getPlayerGameState(game: Game, playerId: string): GameState {
  const isHost = playerId === game.hostId;
  const mySelectedPlayer = isHost ? game.hostSelectedPlayer : game.guestSelectedPlayer;
  const opponentSelectedPlayer = isHost ? game.guestSelectedPlayer : game.hostSelectedPlayer;
  
  // Only expose necessary information
  return {
    gameId: game.id,
    status: game.status,
    myTurn: game.currentTurn === playerId,
    mySelectedPlayer,
    opponentSelectedPlayerId: opponentSelectedPlayer.id, // Only expose ID
    availablePlayers: game.availablePlayers,
    turnCount: game.turnCount,
    winner: game.winner,
  };
}

/**
 * Checks if a player has won by making a correct guess
 */
export function checkWinCondition(game: Game, guessedPlayerId: string, currentPlayerId: string): boolean {
  const isHost = currentPlayerId === game.hostId;
  const opponentSelectedPlayer = isHost ? game.guestSelectedPlayer : game.hostSelectedPlayer;
  
  return opponentSelectedPlayer.id === guessedPlayerId;
}

/**
 * Generate a question for AI player
 */
export function generateAIQuestion(game: Game, availablePlayers: Player[]): Question {
  // Simple strategy - pick the attribute that eliminates closest to half of remaining players
  const attributeTypes = Object.keys(availablePlayers[0].attributes);
  let bestQuestion: Question | null = null;
  let bestScore = Number.MAX_VALUE;
  
  // For each attribute, find the value that gets closest to eliminating half the players
  attributeTypes.forEach(attributeType => {
    // Get all unique values for this attribute
    const values = [...new Set(availablePlayers.map(p => p.attributes[attributeType]))];
    
    values.forEach(value => {
      const matchCount = availablePlayers.filter(p => p.attributes[attributeType] === value).length;
      const score = Math.abs(matchCount - availablePlayers.length / 2);
      
      if (score < bestScore) {
        bestScore = score;
        bestQuestion = {
          id: uuidv4(),
          attributeType,
          attributeValue: value,
          text: `Is the player's ${attributeType} ${value}?`
        };
      }
    });
  });
  
  return bestQuestion || {
    id: uuidv4(),
    property: 'team',
    value: availablePlayers[0].team,
    text: `Is the player from ${availablePlayers[0].team}?`
  };
}

/**
 * Make AI player guess after enough information is gathered
 */
export function makeAIGuess(game: Game, availablePlayers: Player[]): string | null {
  // If only a few players remain, make a guess
  if (availablePlayers.length <= 3) {
    // Pick randomly from remaining players
    const randomIndex = Math.floor(Math.random() * availablePlayers.length);
    return availablePlayers[randomIndex].id;
  }
  
  return null; // Not ready to guess yet
} 