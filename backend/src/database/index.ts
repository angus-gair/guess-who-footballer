import { Game, User, GameEvent } from '../models';

/**
 * Simple in-memory database implementation.
 * For a production app, this would be replaced with a real database connection.
 */
export class Database {
  private games: Map<string, Game> = new Map();
  private users: Map<string, User> = new Map();
  private gameEvents: Map<string, GameEvent> = new Map();

  // Game methods
  async getGame(id: string): Promise<Game | null> {
    return this.games.get(id) || null;
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async saveGame(game: Game): Promise<Game> {
    game.updatedAt = new Date();
    this.games.set(game.id, game);
    return game;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async getGamesByUserId(userId: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => {
      return game.history.some(event => event.playerId === userId);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.username === username) || null;
  }

  async saveUser(user: User): Promise<User> {
    user.updatedAt = new Date();
    this.users.set(user.id, user);
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Game Event methods
  async saveGameEvent(event: GameEvent): Promise<GameEvent> {
    this.gameEvents.set(event.id, event);
    return event;
  }

  async getGameEvents(gameId: string): Promise<GameEvent[]> {
    return Array.from(this.gameEvents.values())
      .filter(event => event.gameId === gameId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

// Export a singleton instance
export const db = new Database(); 