import { GameRepository } from '../repositories/game';
import { PlayerService } from './player';
import { QuestionService } from './question';
import { UserService } from './user';
import { Game, GameCreate, GameUpdate, GameStatus, Player, Question, User } from '../models';
import { AppError } from '../utils/errors';
import { AIPlayerService } from './aiPlayer';

/**
 * Service for managing guess-who-footballer games
 */
export class GameService {
  private gameRepository: GameRepository;
  private playerService: PlayerService;
  private questionService: QuestionService;
  private userService: UserService;
  private aiPlayerService: AIPlayerService;

  constructor() {
    this.gameRepository = new GameRepository();
    this.playerService = new PlayerService();
    this.questionService = new QuestionService();
    this.userService = new UserService();
    this.aiPlayerService = new AIPlayerService();
  }

  /**
   * Create a new game
   * @param gameData Game creation data
   * @returns Created game
   */
  async createGame(gameData: GameCreate): Promise<Game> {
    // Validate required fields
    if (!gameData.userId) {
      throw new AppError('User ID is required', 400);
    }

    // Check if user exists
    const user = await this.userService.getUserById(gameData.userId);

    // Set up game with players and initial state
    const players = await this.playerService.getRandomPlayersForGame(24);
    if (players.length === 0) {
      throw new AppError('Unable to start game: no players available', 500);
    }

    // Create initial game state
    const gameState = {
      players: players.map(player => ({
        id: player.id,
        visible: true
      })),
      selectedPlayerId: null,
      askedQuestions: [],
      currentTurn: 'player',
      turnCount: 0
    };

    // Create the game with initial state
    const gameCreateData = {
      ...gameData,
      status: GameStatus.IN_PROGRESS,
      aiOpponent: gameData.aiOpponent ?? true,
      state: gameState
    };

    const game = await this.gameRepository.create(gameCreateData);

    // If AI opponent is enabled, select a random player for the AI
    if (game.aiOpponent) {
      const randomIndex = Math.floor(Math.random() * players.length);
      game.aiSelectedPlayerId = players[randomIndex].id;
      await this.gameRepository.update(game.id, { aiSelectedPlayerId: game.aiSelectedPlayerId });
    }

    return game;
  }

  /**
   * Get a game by ID
   * @param id Game ID
   * @returns Game or throws if not found
   */
  async getGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new AppError('Game not found', 404);
    }
    return game;
  }

  /**
   * Get all games for a user
   * @param userId User ID
   * @returns Array of games
   */
  async getGamesByUserId(userId: string): Promise<Game[]> {
    return this.gameRepository.findByUserId(userId);
  }

  /**
   * Update game state
   * @param id Game ID
   * @param gameData Game update data
   * @returns Updated game
   */
  async updateGame(id: string, gameData: GameUpdate): Promise<Game> {
    const game = await this.getGameById(id);
    return this.gameRepository.update(id, gameData);
  }

  /**
   * Select a player for the user in the game
   * @param gameId Game ID
   * @param playerId Player ID
   * @returns Updated game
   */
  async selectPlayer(gameId: string, playerId: string): Promise<Game> {
    const game = await this.getGameById(gameId);

    // Game must be in progress
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new AppError('Cannot select player: game is not in progress', 400);
    }

    // Check if player exists in the game
    const playerExists = game.state.players.some(p => p.id === playerId);
    if (!playerExists) {
      throw new AppError('Player not part of this game', 400);
    }

    // Update game state with selected player
    return this.gameRepository.update(gameId, { 
      state: {
        ...game.state,
        selectedPlayerId: playerId
      }
    });
  }

  /**
   * Ask a question in the game
   * @param gameId Game ID
   * @param questionId Question ID
   * @param answer Player's answer (if applicable)
   * @returns Updated game with answer result
   */
  async askQuestion(gameId: string, questionId: string, answer?: any): Promise<Game> {
    const game = await this.getGameById(gameId);
    const question = await this.questionService.getQuestionById(questionId);

    // Game must be in progress
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new AppError('Cannot ask question: game is not in progress', 400);
    }

    // Question must not have been asked already
    if (game.state.askedQuestions.some(q => q.questionId === questionId)) {
      throw new AppError('This question has already been asked', 400);
    }

    let questionResult;
    let updatedGameState;

    // Handle based on current turn
    if (game.state.currentTurn === 'player') {
      // Player is asking AI
      if (!game.aiOpponent || !game.aiSelectedPlayerId) {
        throw new AppError('No AI opponent in this game', 400);
      }

      // Get the AI's selected player
      const aiPlayer = await this.playerService.getPlayerById(game.aiSelectedPlayerId);
      
      // Evaluate the question against the AI's selected player
      questionResult = await this.evaluateQuestionForPlayer(question, aiPlayer);

      // Process player's question results
      updatedGameState = await this.processQuestionResults(
        game, 
        question, 
        questionResult,
        'player'
      );

      // AI's turn is next
      updatedGameState.currentTurn = 'ai';
    } else {
      // AI is asking player
      if (!game.state.selectedPlayerId) {
        throw new AppError('Player has not selected a footballer yet', 400);
      }

      // Validate answer is provided
      if (answer === undefined) {
        throw new AppError('Answer is required for AI question', 400);
      }

      // Record the answer
      questionResult = {
        questionId: questionId,
        answer: answer,
        timestamp: new Date().toISOString()
      };

      // Process AI's question results
      updatedGameState = await this.processQuestionResults(
        game, 
        question, 
        questionResult,
        'ai'
      );

      // Player's turn is next
      updatedGameState.currentTurn = 'player';
    }

    // Increment turn count
    updatedGameState.turnCount++;

    // Update game state
    const updatedGame = await this.gameRepository.update(gameId, { 
      state: updatedGameState
    });

    // Check if game should be ended
    return this.checkGameEnd(updatedGame);
  }

  /**
   * Make a guess for the opponent's selected player
   * @param gameId Game ID
   * @param playerId The guessed player ID
   * @returns Updated game with guess result
   */
  async makeGuess(gameId: string, playerId: string): Promise<Game> {
    const game = await this.getGameById(gameId);

    // Game must be in progress
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new AppError('Cannot make guess: game is not in progress', 400);
    }

    // Check if the guessed player exists in the game
    const playerExists = game.state.players.some(p => p.id === playerId);
    if (!playerExists) {
      throw new AppError('Player not part of this game', 400);
    }

    let correct = false;
    let updatedGame;

    // Handle based on current turn
    if (game.state.currentTurn === 'player') {
      // Player is guessing AI's footballer
      if (!game.aiOpponent || !game.aiSelectedPlayerId) {
        throw new AppError('No AI opponent in this game', 400);
      }

      correct = playerId === game.aiSelectedPlayerId;
      
      if (correct) {
        // Player wins
        updatedGame = await this.gameRepository.update(gameId, {
          status: GameStatus.COMPLETED,
          winnerId: game.userId,
          endedAt: new Date()
        });
      } else {
        // Incorrect guess, AI's turn
        updatedGame = await this.gameRepository.update(gameId, {
          state: {
            ...game.state,
            currentTurn: 'ai'
          }
        });
      }
    } else {
      // AI is guessing player's footballer
      if (!game.state.selectedPlayerId) {
        throw new AppError('Player has not selected a footballer yet', 400);
      }

      correct = playerId === game.state.selectedPlayerId;
      
      if (correct) {
        // AI wins
        updatedGame = await this.gameRepository.update(gameId, {
          status: GameStatus.COMPLETED,
          winnerId: 'ai',
          endedAt: new Date()
        });
      } else {
        // Incorrect guess, player's turn
        updatedGame = await this.gameRepository.update(gameId, {
          state: {
            ...game.state,
            currentTurn: 'player'
          }
        });
      }
    }

    return updatedGame;
  }

  /**
   * Get the next AI question for the game
   * @param gameId Game ID
   * @returns Question to be asked by AI
   */
  async getNextAIQuestion(gameId: string): Promise<Question> {
    const game = await this.getGameById(gameId);

    // Game must be in progress and it must be AI's turn
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new AppError('Game is not in progress', 400);
    }

    if (game.state.currentTurn !== 'ai') {
      throw new AppError('Not AI turn', 400);
    }

    // Get already asked question IDs
    const askedQuestionIds = game.state.askedQuestions.map(q => q.questionId);

    // Get all available questions that haven't been asked yet
    const allQuestions = await this.questionService.getAllQuestions();
    const availableQuestions = allQuestions.filter(q => !askedQuestionIds.includes(q.id));

    if (availableQuestions.length === 0) {
      throw new AppError('No more questions available', 400);
    }

    // Allow AI player service to select the next best question
    return this.aiPlayerService.selectNextQuestion(game, availableQuestions);
  }

  /**
   * Process AI's guess based on current game state
   * @param gameId Game ID
   * @returns The player ID that AI guessed
   */
  async processAIGuess(gameId: string): Promise<string> {
    const game = await this.getGameById(gameId);

    // Game must be in progress and it must be AI's turn
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new AppError('Game is not in progress', 400);
    }

    if (game.state.currentTurn !== 'ai') {
      throw new AppError('Not AI turn', 400);
    }

    // Get visible players
    const visiblePlayers = game.state.players.filter(p => p.visible);
    
    // If only one player is visible, AI will guess that one
    if (visiblePlayers.length === 1) {
      return visiblePlayers[0].id;
    }

    // Otherwise, use AI player service to make the best guess
    const guessedPlayerId = await this.aiPlayerService.makeGuess(game);
    
    // Make the guess
    await this.makeGuess(gameId, guessedPlayerId);
    
    return guessedPlayerId;
  }

  /**
   * Check if the game should be ended (only one player visible)
   * @param game Current game state
   * @returns Updated game if ended, otherwise the same game
   */
  private async checkGameEnd(game: Game): Promise<Game> {
    // If game is already completed, return as is
    if (game.status === GameStatus.COMPLETED) {
      return game;
    }

    const visiblePlayers = game.state.players.filter(p => p.visible);
    
    // If only one player is visible, the game is completed
    if (visiblePlayers.length === 1) {
      // If it's player's turn, AI wins since player couldn't narrow down
      // If it's AI's turn, player wins since AI couldn't narrow down
      const winnerId = game.state.currentTurn === 'player' ? 'ai' : game.userId;
      
      return this.gameRepository.update(game.id, {
        status: GameStatus.COMPLETED,
        winnerId: winnerId,
        endedAt: new Date()
      });
    }

    return game;
  }

  /**
   * Evaluate a question against a player to get the answer
   * @param question Question to evaluate
   * @param player Player to evaluate against
   * @returns Question result with answer
   */
  private async evaluateQuestionForPlayer(question: Question, player: Player): Promise<any> {
    let answer;

    if (question.attribute) {
      // Use player service to check the attribute
      answer = await this.playerService.checkPlayerAttribute(
        player.id, 
        question.attribute, 
        question.expectedValue
      );
    } else {
      // For questions without specific attributes, use a default answer
      answer = false;
    }

    return {
      questionId: question.id,
      answer: answer,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process question results and update game state
   * @param game Current game
   * @param question Question that was asked
   * @param result Question result
   * @param askedBy Who asked the question ('player' or 'ai')
   * @returns Updated game state
   */
  private async processQuestionResults(
    game: Game, 
    question: Question, 
    result: any,
    askedBy: 'player' | 'ai'
  ): Promise<any> {
    // Add question to asked questions
    const updatedAskedQuestions = [
      ...game.state.askedQuestions,
      result
    ];

    // Update visible players based on question answer
    let updatedPlayers = [...game.state.players];

    if (askedBy === 'player') {
      // Player asked, eliminate players based on answer
      updatedPlayers = await this.eliminatePlayersByAnswer(
        updatedPlayers,
        question,
        result.answer
      );
    } else {
      // AI asked, we don't automatically eliminate players since
      // the player decides which ones to eliminate based on their selection
    }

    return {
      ...game.state,
      players: updatedPlayers,
      askedQuestions: updatedAskedQuestions
    };
  }

  /**
   * Eliminate players based on question answer
   * @param players Current players in game
   * @param question Question that was asked
   * @param answer Answer to the question
   * @returns Updated players array with visibility updated
   */
  private async eliminatePlayersByAnswer(
    players: any[],
    question: Question,
    answer: any
  ): Promise<any[]> {
    // If no attribute to filter by, return players unchanged
    if (!question.attribute) {
      return players;
    }

    // Get full player data for each player in the game
    const playerIds = players.map(p => p.id);
    const fullPlayerData: Player[] = [];
    
    for (const playerId of playerIds) {
      try {
        const player = await this.playerService.getPlayerById(playerId);
        fullPlayerData.push(player);
      } catch (error) {
        // If player not found, skip
        continue;
      }
    }

    // Create map of player attributes
    const playerAttributeMap = new Map<string, any>();
    fullPlayerData.forEach(player => {
      if (player.attributes && player.attributes[question.attribute]) {
        playerAttributeMap.set(player.id, player.attributes[question.attribute]);
      }
    });

    // Update visibility based on answer
    return players.map(player => {
      const playerAttribute = playerAttributeMap.get(player.id);
      
      // Skip players that are already hidden
      if (!player.visible) {
        return player;
      }
      
      // If player doesn't have the attribute, hide if answer is true
      if (playerAttribute === undefined) {
        return {
          ...player,
          visible: !answer
        };
      }
      
      let matches = false;
      
      // Check if player attribute matches expected value
      if (Array.isArray(playerAttribute)) {
        // For array attributes, check if it includes the expected value
        matches = playerAttribute.includes(question.expectedValue);
      } else if (typeof playerAttribute === 'string' && typeof question.expectedValue === 'string') {
        // Case-insensitive string comparison
        matches = playerAttribute.toLowerCase() === question.expectedValue.toLowerCase();
      } else {
        // Direct comparison for other types
        matches = playerAttribute === question.expectedValue;
      }
      
      // If answer is true, hide players that don't match
      // If answer is false, hide players that match
      return {
        ...player,
        visible: answer ? matches : !matches
      };
    });
  }
} 