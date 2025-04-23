import { Question, QuestionCreate, QuestionCategory } from '../models';
import prisma from '../utils/prisma';

/**
 * Question repository for database operations
 */
export class QuestionRepository {
  /**
   * Create a new question
   * @param data Question data
   * @returns Created question
   */
  async create(data: QuestionCreate): Promise<Question> {
    return prisma.question.create({
      data,
    });
  }

  /**
   * Find question by ID
   * @param id Question ID
   * @returns Question if found, null otherwise
   */
  async findById(id: string): Promise<Question | null> {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  /**
   * Find all questions
   * @returns List of questions
   */
  async findAll(): Promise<Question[]> {
    return prisma.question.findMany();
  }

  /**
   * Find questions by category
   * @param category Category to filter by
   * @returns List of questions
   */
  async findByCategory(category: string): Promise<Question[]> {
    return prisma.question.findMany({
      where: { category },
    });
  }

  /**
   * Get all categories with their questions
   * @returns List of question categories
   */
  async getCategories(): Promise<QuestionCategory[]> {
    const questions = await prisma.question.findMany({
      orderBy: { category: 'asc' },
    });

    const categoriesMap: Record<string, QuestionCategory> = {};

    questions.forEach((question) => {
      if (!categoriesMap[question.category]) {
        categoriesMap[question.category] = {
          id: question.category,
          name: question.category,
          questions: [],
        };
      }

      categoriesMap[question.category].questions.push(question);
    });

    return Object.values(categoriesMap);
  }

  /**
   * Update question
   * @param id Question ID
   * @param data Question data to update
   * @returns Updated question
   */
  async update(id: string, data: Partial<Question>): Promise<Question> {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete question
   * @param id Question ID
   * @returns Deleted question
   */
  async delete(id: string): Promise<Question> {
    return prisma.question.delete({
      where: { id },
    });
  }
} 