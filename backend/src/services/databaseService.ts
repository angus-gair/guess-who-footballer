import { Game, GameStatus, Player, Question, GameEvent, EventType } from '../models/game';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory database service for the MVP version.
 * In a production environment, this would be replaced with a real database.
 */
export class DatabaseService {
  private db: InMemoryDatabase;

  constructor() {
    this.db = new InMemoryDatabase();
  }

  // Game methods
  public createGame(creatorId: string, creatorName: string, footballers: string[]): Game {
    const gameId = uuidv4();
    const creator: Player = this.createPlayer(creatorId, creatorName);
    
    const game: Game = {
      id: gameId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: GameStatus.WAITING_FOR_PLAYER,
      players: [creator.id],
      footballers,
      currentTurn: creator.id,
      winner: null,
      events: []
    };
    
    return this.db.createGame(game);
  }

  public getGame(gameId: string): Game | null {
    return this.db.getGame(gameId) || null;
  }

  public updateGame(game: Game): Game {
    game.updatedAt = new Date();
    return this.db.updateGame(game);
  }

  public deleteGame(gameId: string): boolean {
    return this.db.deleteGame(gameId);
  }

  public getActiveGames(): Game[] {
    return this.db.getActiveGames();
  }

  // Player methods
  public createPlayer(userId: string, name: string): Player {
    const existingPlayer = this.getPlayerByUserId(userId);
    if (existingPlayer) {
      return existingPlayer;
    }

    const player: Player = {
      id: userId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      selectedFootballer: null,
      eliminatedFootballers: [],
      askedQuestions: []
    };
    
    return this.db.createPlayer(player);
  }

  public getPlayer(playerId: string): Player | null {
    return this.db.getPlayer(playerId) || null;
  }

  public getPlayerByUserId(userId: string): Player | null {
    return this.getPlayer(userId);
  }

  public updatePlayer(player: Player): Player {
    player.updatedAt = new Date();
    return this.db.updatePlayer(player);
  }

  public deletePlayer(id: string): boolean {
    return this.db.deletePlayer(id);
  }

  // Game Event methods
  public createGameEvent(gameId: string, type: EventType, data: any, playerId?: string): GameEvent {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }

    const event: GameEvent = {
      id: uuidv4(),
      gameId,
      playerId,
      type,
      data,
      timestamp: new Date()
    };

    game.events.push(event);
    this.updateGame(game);
    
    return this.db.createGameEvent(event);
  }

  public getGameEvents(gameId: string): GameEvent[] {
    return this.db.getGameEvents(gameId);
  }

  // Question methods
  public createQuestion(gameId: string, playerId: string, questionText: string): Question {
    const player = this.getPlayer(playerId);
    if (!player) {
      throw new Error(`Player with ID ${playerId} not found`);
    }

    const question: Question = {
      id: uuidv4(),
      gameId,
      playerId,
      questionText,
      answer: null,
      timestamp: new Date()
    };

    player.askedQuestions.push(question);
    this.updatePlayer(player);
    
    return this.db.createQuestion(question);
  }

  public updateQuestion(question: Question): Question {
    const player = this.getPlayer(question.playerId);
    if (!player) {
      throw new Error(`Player with ID ${question.playerId} not found`);
    }

    const questionIndex = player.askedQuestions.findIndex(q => q.id === question.id);
    if (questionIndex !== -1) {
      player.askedQuestions[questionIndex] = question;
      this.updatePlayer(player);
    }
    
    return this.db.updateQuestion(question);
  }

  public getGameQuestions(gameId: string): Question[] {
    return this.db.getGameQuestions(gameId);
  }
}

class InMemoryDatabase {
  private games: Map<string, Game> = new Map();
  private players: Map<string, Player> = new Map();
  private questions: Map<string, Question> = new Map();
  private gameEvents: Map<string, GameEvent> = new Map();

  // Game operations
  public createGame(game: Game): Game {
    this.games.set(game.id, game);
    return game;
  }

  public getGame(id: string): Game | undefined {
    return this.games.get(id);
  }

  public updateGame(game: Game): Game {
    this.games.set(game.id, game);
    return game;
  }

  public deleteGame(id: string): boolean {
    return this.games.delete(id);
  }

  public getActiveGames(): Game[] {
    return Array.from(this.games.values()).filter(
      game => game.status !== GameStatus.FINISHED
    );
  }

  // Player operations
  public createPlayer(player: Player): Player {
    this.players.set(player.id, player);
    return player;
  }

  public getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  public updatePlayer(player: Player): Player {
    this.players.set(player.id, player);
    return player;
  }

  public deletePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  // Question operations
  public createQuestion(question: Question): Question {
    this.questions.set(question.id, question);
    return question;
  }

  public getQuestion(id: string): Question | undefined {
    return this.questions.get(id);
  }

  public updateQuestion(question: Question): Question {
    this.questions.set(question.id, question);
    return question;
  }

  public getGameQuestions(gameId: string): Question[] {
    return Array.from(this.questions.values()).filter(
      question => question.gameId === gameId
    );
  }

  // GameEvent operations
  public createGameEvent(event: GameEvent): GameEvent {
    this.gameEvents.set(event.id, event);
    return event;
  }

  public getGameEvents(gameId: string): GameEvent[] {
    return Array.from(this.gameEvents.values())
      .filter(event => event.gameId === gameId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
} 