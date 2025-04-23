import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../database';
import { 
  Game, 
  Player, 
  GameStatus, 
  GameMode, 
  Question,
  User
} from '../models';
import { 
  createGame, 
  createGameEvent, 
  checkQuestion, 
  filterPlayers,
  getPlayerGameState,
  checkWinCondition,
  generateAIQuestion,
  makeAIGuess
} from '../utils/gameLogic';
import { WebSocketService } from '../services/websocketService';
import { DatabaseService } from '../services/databaseService';
import { FootballerService } from '../services/footballerService';

// Instance of the database
const db = new Database();
// Instance of the WebSocket service
let wsService: WebSocketService;

export const setWebSocketService = (service: WebSocketService) => {
  wsService = service;
};

export class GameController {
  private databaseService: DatabaseService;
  private footballerService: FootballerService;

  constructor(databaseService: DatabaseService, footballerService: FootballerService) {
    this.databaseService = databaseService;
    this.footballerService = footballerService;
  }

  // Create a new game
  public createGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { playerId } = req.body;

      if (!playerId) {
        res.status(400).json({ error: 'PlayerId is required' });
        return;
      }

      // Get player from database
      const player = this.databaseService.getPlayer(playerId);
      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      // Get a random set of footballers for the game
      const footballers = await this.footballerService.getRandomFootballers(24);
      
      // Create a new game
      const game: Game = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: GameStatus.WAITING_FOR_PLAYER,
        players: [playerId],
        footballers: footballers.map(f => f.id),
        currentTurn: playerId,
        winner: null,
        events: []
      };

      // Save the game
      const savedGame = this.databaseService.createGame(game);

      // Create game created event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId: savedGame.id,
        playerId,
        type: EventType.GAME_CREATED,
        data: { game: savedGame },
        timestamp: new Date()
      });

      res.status(201).json({ game: savedGame, footballers });
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ error: 'Failed to create game' });
    }
  };

  // Join an existing game
  public joinGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;

      if (!playerId) {
        res.status(400).json({ error: 'PlayerId is required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Get player from database
      const player = this.databaseService.getPlayer(playerId);
      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      // Check if game is in the correct state
      if (game.status !== GameStatus.WAITING_FOR_PLAYER) {
        res.status(400).json({ error: 'Game is not in the waiting state' });
        return;
      }

      // Add player to the game
      if (!game.players.includes(playerId)) {
        game.players.push(playerId);
      } else {
        res.status(400).json({ error: 'Player already in the game' });
        return;
      }

      // Update game status
      game.status = GameStatus.SELECTING_FOOTBALLERS;
      game.updatedAt = new Date();

      // Save the updated game
      const updatedGame = this.databaseService.updateGame(game);

      // Create player joined event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId: updatedGame.id,
        playerId,
        type: EventType.PLAYER_JOINED,
        data: { player },
        timestamp: new Date()
      });

      // Get the footballers for the game
      const footballers = await this.footballerService.getFootballersByIds(game.footballers);

      res.status(200).json({ game: updatedGame, footballers });
    } catch (error) {
      console.error('Error joining game:', error);
      res.status(500).json({ error: 'Failed to join game' });
    }
  };

  // Get a game by ID
  public getGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      
      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Get the footballers for the game
      const footballers = await this.footballerService.getFootballersByIds(game.footballers);

      res.status(200).json({ game, footballers });
    } catch (error) {
      console.error('Error getting game:', error);
      res.status(500).json({ error: 'Failed to get game' });
    }
  };

  // Select a footballer
  public selectFootballer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      const { playerId, footballerId } = req.body;

      if (!playerId || !footballerId) {
        res.status(400).json({ error: 'PlayerId and footballerId are required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if player is in the game
      if (!game.players.includes(playerId)) {
        res.status(403).json({ error: 'Player is not in this game' });
        return;
      }

      // Check if footballer is valid for this game
      if (!game.footballers.includes(footballerId)) {
        res.status(400).json({ error: 'Invalid footballer for this game' });
        return;
      }

      // Get player
      const player = this.databaseService.getPlayer(playerId);
      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      // Update player's selected footballer
      player.selectedFootballer = footballerId;
      player.updatedAt = new Date();
      this.databaseService.updatePlayer(player);

      // Create footballer selected event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId,
        playerId,
        type: EventType.FOOTBALLER_SELECTED,
        data: { footballerId },
        timestamp: new Date()
      });

      // Check if both players have selected footballers
      let allPlayersSelected = true;
      for (const pid of game.players) {
        const p = this.databaseService.getPlayer(pid);
        if (!p || !p.selectedFootballer) {
          allPlayersSelected = false;
          break;
        }
      }

      // If all players selected, update game status
      if (allPlayersSelected && game.status === GameStatus.SELECTING_FOOTBALLERS) {
        game.status = GameStatus.IN_PROGRESS;
        game.updatedAt = new Date();
        this.databaseService.updateGame(game);

        // Create game started event
        this.databaseService.createGameEvent({
          id: uuidv4(),
          gameId,
          type: EventType.GAME_STARTED,
          data: {},
          timestamp: new Date()
        });
      }

      res.status(200).json({ success: true, player });
    } catch (error) {
      console.error('Error selecting footballer:', error);
      res.status(500).json({ error: 'Failed to select footballer' });
    }
  };

  // Ask a question
  public askQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      const { playerId, questionText } = req.body;

      if (!playerId || !questionText) {
        res.status(400).json({ error: 'PlayerId and questionText are required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if game is in progress
      if (game.status !== GameStatus.IN_PROGRESS) {
        res.status(400).json({ error: 'Game is not in progress' });
        return;
      }

      // Check if player is in the game
      if (!game.players.includes(playerId)) {
        res.status(403).json({ error: 'Player is not in this game' });
        return;
      }

      // Check if it's the player's turn
      if (game.currentTurn !== playerId) {
        res.status(403).json({ error: 'Not your turn' });
        return;
      }

      // Create question
      const question = {
        id: uuidv4(),
        gameId,
        playerId,
        questionText,
        answer: null,
        timestamp: new Date()
      };

      this.databaseService.createQuestion(question);

      // Create question asked event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId,
        playerId,
        type: EventType.QUESTION_ASKED,
        data: { question },
        timestamp: new Date()
      });

      res.status(201).json({ question });
    } catch (error) {
      console.error('Error asking question:', error);
      res.status(500).json({ error: 'Failed to ask question' });
    }
  };

  // Answer a question
  public answerQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId, questionId } = req.params;
      const { playerId, answer } = req.body;

      if (!playerId || answer === undefined) {
        res.status(400).json({ error: 'PlayerId and answer are required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if game is in progress
      if (game.status !== GameStatus.IN_PROGRESS) {
        res.status(400).json({ error: 'Game is not in progress' });
        return;
      }

      // Check if player is in the game
      if (!game.players.includes(playerId)) {
        res.status(403).json({ error: 'Player is not in this game' });
        return;
      }

      // Get the question
      const question = this.databaseService.getQuestion(questionId);
      if (!question || question.gameId !== gameId) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }

      // Make sure answering player is not the asker
      if (question.playerId === playerId) {
        res.status(403).json({ error: 'Cannot answer your own question' });
        return;
      }

      // Update question
      question.answer = answer;
      this.databaseService.updateQuestion(question);

      // Create question answered event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId,
        playerId,
        type: EventType.QUESTION_ANSWERED,
        data: { question },
        timestamp: new Date()
      });

      // Change the turn
      game.currentTurn = question.playerId;
      game.updatedAt = new Date();
      this.databaseService.updateGame(game);

      // Create turn changed event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId,
        type: EventType.TURN_CHANGED,
        data: { currentTurn: game.currentTurn },
        timestamp: new Date()
      });

      res.status(200).json({ question, game });
    } catch (error) {
      console.error('Error answering question:', error);
      res.status(500).json({ error: 'Failed to answer question' });
    }
  };

  // Eliminate a footballer
  public eliminateFootballer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      const { playerId, footballerId } = req.body;

      if (!playerId || !footballerId) {
        res.status(400).json({ error: 'PlayerId and footballerId are required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if game is in progress
      if (game.status !== GameStatus.IN_PROGRESS) {
        res.status(400).json({ error: 'Game is not in progress' });
        return;
      }

      // Check if player is in the game
      if (!game.players.includes(playerId)) {
        res.status(403).json({ error: 'Player is not in this game' });
        return;
      }

      // Get player
      const player = this.databaseService.getPlayer(playerId);
      if (!player) {
        res.status(404).json({ error: 'Player not found' });
        return;
      }

      // Check if footballer is valid for this game
      if (!game.footballers.includes(footballerId)) {
        res.status(400).json({ error: 'Invalid footballer for this game' });
        return;
      }

      // Add to eliminated list if not already there
      if (!player.eliminatedFootballers.includes(footballerId)) {
        player.eliminatedFootballers.push(footballerId);
        player.updatedAt = new Date();
        this.databaseService.updatePlayer(player);
      }

      // Create footballer eliminated event
      this.databaseService.createGameEvent({
        id: uuidv4(),
        gameId,
        playerId,
        type: EventType.FOOTBALLER_ELIMINATED,
        data: { footballerId },
        timestamp: new Date()
      });

      // Check if player has eliminated all but one footballer (potential win)
      const remainingFootballers = game.footballers.filter(
        fId => !player.eliminatedFootballers.includes(fId)
      );

      if (remainingFootballers.length === 1) {
        // Get the opponent
        const opponentId = game.players.find(pid => pid !== playerId);
        if (opponentId) {
          const opponent = this.databaseService.getPlayer(opponentId);
          
          // Check if the remaining footballer is the opponent's selected footballer
          if (opponent && remainingFootballers[0] === opponent.selectedFootballer) {
            // Player wins!
            game.status = GameStatus.FINISHED;
            game.winner = playerId;
            game.updatedAt = new Date();
            this.databaseService.updateGame(game);

            // Create game won event
            this.databaseService.createGameEvent({
              id: uuidv4(),
              gameId,
              playerId,
              type: EventType.GAME_WON,
              data: { winner: playerId },
              timestamp: new Date()
            });
          }
        }
      }

      res.status(200).json({ player, game });
    } catch (error) {
      console.error('Error eliminating footballer:', error);
      res.status(500).json({ error: 'Failed to eliminate footballer' });
    }
  };

  // Make a guess about opponent's footballer
  public makeGuess = async (req: Request, res: Response): Promise<void> => {
    try {
      const { gameId } = req.params;
      const { playerId, footballerId } = req.body;

      if (!playerId || !footballerId) {
        res.status(400).json({ error: 'PlayerId and footballerId are required' });
        return;
      }

      // Get the game
      const game = this.databaseService.getGame(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if game is in progress
      if (game.status !== GameStatus.IN_PROGRESS) {
        res.status(400).json({ error: 'Game is not in progress' });
        return;
      }

      // Check if player is in the game
      if (!game.players.includes(playerId)) {
        res.status(403).json({ error: 'Player is not in this game' });
        return;
      }

      // Check if it's the player's turn
      if (game.currentTurn !== playerId) {
        res.status(403).json({ error: 'Not your turn' });
        return;
      }

      // Get opponent's ID
      const opponentId = game.players.find(pid => pid !== playerId);
      if (!opponentId) {
        res.status(400).json({ error: 'Opponent not found' });
        return;
      }

      // Get opponent
      const opponent = this.databaseService.getPlayer(opponentId);
      if (!opponent) {
        res.status(404).json({ error: 'Opponent not found' });
        return;
      }

      // Check the guess
      const isCorrect = opponent.selectedFootballer === footballerId;

      // Update game state based on guess result
      if (isCorrect) {
        // Player wins!
        game.status = GameStatus.FINISHED;
        game.winner = playerId;
        game.updatedAt = new Date();
        this.databaseService.updateGame(game);

        // Create game won event
        this.databaseService.createGameEvent({
          id: uuidv4(),
          gameId,
          playerId,
          type: EventType.GAME_WON,
          data: { winner: playerId, guessedFootballer: footballerId },
          timestamp: new Date()
        });

        res.status(200).json({ 
          success: true, 
          correct: true, 
          game,
          message: 'Correct guess! You win!'
        });
      } else {
        // Incorrect guess, opponent's turn
        game.currentTurn = opponentId;
        game.updatedAt = new Date();
        this.databaseService.updateGame(game);

        // Create turn changed event
        this.databaseService.createGameEvent({
          id: uuidv4(),
          gameId,
          type: EventType.TURN_CHANGED,
          data: { currentTurn: game.currentTurn },
          timestamp: new Date()
        });

        res.status(200).json({ 
          success: true, 
          correct: false,
          game,
          message: 'Incorrect guess. Turn passes to opponent.'
        });
      }
    } catch (error) {
      console.error('Error making guess:', error);
      res.status(500).json({ error: 'Failed to make guess' });
    }
  };

  // Get active games
  public getActiveGames = async (req: Request, res: Response): Promise<void> => {
    try {
      const activeGames = this.databaseService.getActiveGames();
      res.status(200).json({ games: activeGames });
    } catch (error) {
      console.error('Error getting active games:', error);
      res.status(500).json({ error: 'Failed to get active games' });
    }
  };
} 