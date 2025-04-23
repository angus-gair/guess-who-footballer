import { Game, Player, Question } from '../models';

/**
 * Service for managing AI opponent logic in the game
 */
export class AIPlayerService {
  /**
   * Select the next best question for the AI to ask based on current game state
   * @param game Current game
   * @param availableQuestions Questions that haven't been asked yet
   * @returns Selected question
   */
  async selectNextQuestion(game: Game, availableQuestions: Question[]): Promise<Question> {
    // If there are no available questions, return a random one
    if (availableQuestions.length === 0) {
      throw new Error('No questions available for AI to ask');
    }

    // In a more advanced implementation, this would use a more sophisticated 
    // algorithm to choose the optimal question based on:
    // 1. Current visible players
    // 2. Previous question results
    // 3. Information gain calculation
    
    // For now, implement a simple strategy:
    // Choose question that might eliminate roughly half of remaining players
    
    // Get list of visible players
    const visiblePlayers = game.state.players.filter(p => p.visible);
    
    // If only a few players remain visible, prefer more specific questions
    if (visiblePlayers.length <= 3) {
      // Find questions that target very specific attributes
      const specificQuestions = availableQuestions.filter(q => 
        q.attribute && ['name', 'team', 'nationality', 'position'].includes(q.attribute)
      );
      
      if (specificQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * specificQuestions.length);
        return specificQuestions[randomIndex];
      }
    }
    
    // Otherwise, use a balanced approach
    // Simple random selection for now
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  }

  /**
   * Make an educated guess about which player the user has selected
   * @param game Current game state
   * @returns ID of the player the AI guesses
   */
  async makeGuess(game: Game): Promise<string> {
    // Get list of visible players
    const visiblePlayers = game.state.players.filter(p => p.visible);
    
    if (visiblePlayers.length === 0) {
      throw new Error('No visible players to guess from');
    }
    
    // If only one player is visible, that's our guess
    if (visiblePlayers.length === 1) {
      return visiblePlayers[0].id;
    }
    
    // In a more advanced implementation, this would:
    // 1. Analyze past questions and answers
    // 2. Calculate probabilities for each remaining player
    // 3. Make a strategic guess based on game theory
    
    // For now, implement a simple strategy:
    // Just pick a random player from the visible ones
    const randomIndex = Math.floor(Math.random() * visiblePlayers.length);
    return visiblePlayers[randomIndex].id;
  }
} 