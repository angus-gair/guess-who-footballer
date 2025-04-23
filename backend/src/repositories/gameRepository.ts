import { Game } from '../models';
import { Database } from '../database';

/**
 * Repository for managing game persistence
 */
export class GameRepository {
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
  }
  
  /**
   * Create a new game in the database
   * @param game Game to create
   * @returns Created game with ID
   */
  async create(game: Omit<Game, 'id'>): Promise<Game> {
    // Generate unique ID
    const id = this.generateId();
    
    const newGame: Game = {
      id,
      ...game,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, this would save to a database
    // For now, we're simulating with a simple in-memory store
    await this.db.games.add(newGame);
    
    return newGame;
  }
  
  /**
   * Find a game by its ID
   * @param id Game ID
   * @returns Game if found, null otherwise
   */
  async findById(id: string): Promise<Game | null> {
    return this.db.games.findById(id);
  }
  
  /**
   * Find all games for a specific user
   * @param userId User ID
   * @returns List of games
   */
  async findByUserId(userId: string): Promise<Game[]> {
    return this.db.games.findByUserId(userId);
  }
  
  /**
   * Update an existing game
   * @param id Game ID
   * @param gameData Partial game data to update
   * @returns Updated game
   */
  async update(id: string, gameData: Partial<Game>): Promise<Game> {
    const game = await this.findById(id);
    
    if (!game) {
      throw new Error(`Game with ID ${id} not found`);
    }
    
    const updatedGame: Game = {
      ...game,
      ...gameData,
      updatedAt: new Date()
    };
    
    await this.db.games.update(id, updatedGame);
    
    return updatedGame;
  }
  
  /**
   * Delete a game
   * @param id Game ID
   * @returns Success status
   */
  async delete(id: string): Promise<boolean> {
    return this.db.games.delete(id);
  }
  
  /**
   * Generate a unique ID for a new game
   * @returns Unique ID string
   */
  private generateId(): string {
    return `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
} 