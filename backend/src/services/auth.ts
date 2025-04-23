import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user';
import { AppError } from '../utils/errors';
import { UserLogin, User, UserRegistration } from '../models';
import config from '../config';

/**
 * Authentication service
 */
export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registered user with token
   */
  async register(userData: UserRegistration): Promise<{ user: User; token: string }> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // Create user
    const user = await this.userRepository.create(userData);

    // Generate token
    const token = this.generateToken(user);

    // Return user data (excluding password) and token
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  /**
   * Login user
   * @param credentials User login credentials
   * @returns Logged in user with token
   */
  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    // Check if user exists
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user);

    // Return user data (excluding password) and token
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token,
    };
  }

  /**
   * Get user profile by ID
   * @param userId User ID
   * @returns User profile
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Generate JWT token for user
   * @param user User
   * @returns JWT token
   */
  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      }
    );
  }

  /**
   * Verify JWT token
   * @param token JWT token
   * @returns Decoded token payload
   */
  verifyToken(token: string): { id: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string; email: string; role: string };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
} 