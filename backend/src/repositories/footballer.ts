import { Footballer, FootballerCreate, Position } from '../models';
import prisma from '../utils/prisma';

/**
 * Footballer repository for database operations
 */
export class FootballerRepository {
  /**
   * Create a new footballer
   * @param data Footballer data
   * @returns Created footballer
   */
  async create(data: FootballerCreate): Promise<Footballer> {
    return prisma.footballer.create({
      data,
    });
  }

  /**
   * Find footballer by ID
   * @param id Footballer ID
   * @returns Footballer if found, null otherwise
   */
  async findById(id: string): Promise<Footballer | null> {
    return prisma.footballer.findUnique({
      where: { id },
    });
  }

  /**
   * Find all footballers
   * @param limit Maximum number of footballers to return
   * @param offset Number of footballers to skip
   * @returns List of footballers
   */
  async findAll(limit?: number, offset?: number): Promise<Footballer[]> {
    return prisma.footballer.findMany({
      take: limit,
      skip: offset,
    });
  }

  /**
   * Find footballers by position
   * @param position Position to filter by
   * @param limit Maximum number of footballers to return
   * @param offset Number of footballers to skip
   * @returns List of footballers
   */
  async findByPosition(position: Position, limit?: number, offset?: number): Promise<Footballer[]> {
    return prisma.footballer.findMany({
      where: { position },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Find random footballer
   * @returns Random footballer
   */
  async findRandom(): Promise<Footballer | null> {
    const count = await prisma.footballer.count();
    const skip = Math.floor(Math.random() * count);
    const footballers = await prisma.footballer.findMany({
      take: 1,
      skip,
    });
    return footballers[0] || null;
  }

  /**
   * Find multiple random footballers
   * @param count Number of footballers to get
   * @returns Array of random footballers
   */
  async findRandomMany(count: number): Promise<Footballer[]> {
    // Get all footballers
    const footballers = await prisma.footballer.findMany();
    
    // Shuffle array
    for (let i = footballers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [footballers[i], footballers[j]] = [footballers[j], footballers[i]];
    }
    
    // Return first 'count' elements
    return footballers.slice(0, count);
  }

  /**
   * Update footballer
   * @param id Footballer ID
   * @param data Footballer data to update
   * @returns Updated footballer
   */
  async update(id: string, data: Partial<Footballer>): Promise<Footballer> {
    return prisma.footballer.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete footballer
   * @param id Footballer ID
   * @returns Deleted footballer
   */
  async delete(id: string): Promise<Footballer> {
    return prisma.footballer.delete({
      where: { id },
    });
  }
} 