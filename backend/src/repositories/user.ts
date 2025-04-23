import { User, UserRegistration } from '../models';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';

/**
 * User repository for database operations
 */
export class UserRepository {
  /**
   * Create a new user
   * @param data User registration data
   * @returns Created user
   */
  async create(data: UserRegistration): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        displayName: data.displayName,
      },
    });

    return user;
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns User if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Update user
   * @param id User ID
   * @param data User data to update
   * @returns Updated user
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   * @param id User ID
   * @returns Deleted user
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
} 