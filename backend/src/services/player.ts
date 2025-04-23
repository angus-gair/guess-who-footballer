import { PlayerRepository } from '../repositories/player';
import { Player, PlayerCreate, PlayerUpdate, PlayerAttributeValue } from '../models';
import { AppError } from '../utils/errors';

/**
 * Service for managing football players in the game
 */
export class PlayerService {
  private playerRepository: PlayerRepository;

  constructor() {
    this.playerRepository = new PlayerRepository();
  }

  /**
   * Create a new player
   * @param playerData Player data
   * @returns Created player
   */
  async createPlayer(playerData: PlayerCreate): Promise<Player> {
    // Validate required fields
    if (!playerData.name) {
      throw new AppError('Player name is required', 400);
    }

    return this.playerRepository.create(playerData);
  }

  /**
   * Get a player by ID
   * @param id Player ID
   * @returns Player or throws if not found
   */
  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerRepository.findById(id);
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    return player;
  }

  /**
   * Get all players
   * @param limit Optional limit for number of players to return
   * @param offset Optional offset for pagination
   * @returns Array of players
   */
  async getAllPlayers(limit?: number, offset?: number): Promise<Player[]> {
    return this.playerRepository.findAll(limit, offset);
  }

  /**
   * Get players by attribute value
   * @param attribute Attribute name
   * @param value Attribute value
   * @returns Array of players matching the attribute value
   */
  async getPlayersByAttributeValue(attribute: string, value: any): Promise<Player[]> {
    return this.playerRepository.findByAttributeValue(attribute, value);
  }

  /**
   * Update a player
   * @param id Player ID
   * @param playerData Player update data
   * @returns Updated player
   */
  async updatePlayer(id: string, playerData: PlayerUpdate): Promise<Player> {
    const player = await this.getPlayerById(id);
    return this.playerRepository.update(id, playerData);
  }

  /**
   * Delete a player
   * @param id Player ID
   * @returns True if deleted
   */
  async deletePlayer(id: string): Promise<boolean> {
    const player = await this.getPlayerById(id);
    return this.playerRepository.delete(id);
  }

  /**
   * Get random players for a game
   * @param count Number of players to retrieve
   * @returns Array of random players
   */
  async getRandomPlayersForGame(count: number = 24): Promise<Player[]> {
    const allPlayers = await this.getAllPlayers();
    
    // Ensure we have enough players
    if (allPlayers.length <= count) {
      return allPlayers;
    }
    
    // Shuffle and select random players
    return this.getRandomPlayers(allPlayers, count);
  }

  /**
   * Get all attribute names from players
   * @returns Array of unique attribute names
   */
  async getPlayerAttributes(): Promise<string[]> {
    const players = await this.getAllPlayers(10); // Sample from first 10 players
    const attributes = new Set<string>();
    
    players.forEach(player => {
      if (player.attributes) {
        Object.keys(player.attributes).forEach(key => {
          attributes.add(key);
        });
      }
    });
    
    return Array.from(attributes);
  }

  /**
   * Get all possible values for a specific attribute
   * @param attribute Attribute name
   * @returns Array of unique values for the attribute
   */
  async getAttributeValues(attribute: string): Promise<any[]> {
    const players = await this.getAllPlayers();
    const values = new Set<any>();
    
    players.forEach(player => {
      if (player.attributes && player.attributes[attribute] !== undefined) {
        const value = player.attributes[attribute];
        if (Array.isArray(value)) {
          value.forEach(v => values.add(v));
        } else {
          values.add(value);
        }
      }
    });
    
    return Array.from(values);
  }

  /**
   * Filter players by multiple attribute conditions
   * @param conditions Object with attribute-value pairs to filter by
   * @returns Array of players matching all conditions
   */
  async filterPlayersByAttributes(conditions: Record<string, any>): Promise<Player[]> {
    const allPlayers = await this.getAllPlayers();
    
    return allPlayers.filter(player => {
      if (!player.attributes) return false;
      
      // Check if player matches all conditions
      return Object.entries(conditions).every(([attribute, value]) => {
        const playerValue = player.attributes[attribute];
        
        // Handle different value types
        if (playerValue === undefined) return false;
        
        if (Array.isArray(playerValue)) {
          // For array values, check if the array contains the value
          return playerValue.includes(value);
        } else if (typeof playerValue === 'string' && typeof value === 'string') {
          // Case-insensitive string comparison
          return playerValue.toLowerCase() === value.toLowerCase();
        } else {
          // Direct comparison for other types
          return playerValue === value;
        }
      });
    });
  }

  /**
   * Check if a player matches a specific attribute condition
   * @param playerId Player ID
   * @param attribute Attribute name
   * @param value Attribute value to check
   * @returns True if player matches the condition
   */
  async checkPlayerAttribute(playerId: string, attribute: string, value: any): Promise<boolean> {
    const player = await this.getPlayerById(playerId);
    
    if (!player.attributes || player.attributes[attribute] === undefined) {
      return false;
    }
    
    const playerValue = player.attributes[attribute];
    
    // Handle different value types
    if (Array.isArray(playerValue)) {
      // For array values, check if the array contains the value
      return playerValue.includes(value);
    } else if (typeof playerValue === 'string' && typeof value === 'string') {
      // Case-insensitive string comparison
      return playerValue.toLowerCase() === value.toLowerCase();
    } else {
      // Direct comparison for other types
      return playerValue === value;
    }
  }

  /**
   * Helper to get random players from an array
   * @param players Source array of players
   * @param count Number of players to select
   * @returns Array of randomly selected players
   */
  private getRandomPlayers(players: Player[], count: number): Player[] {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, players.length));
  }
} 