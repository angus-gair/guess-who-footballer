import { QuestionRepository } from '../repositories/question';
import { Question, QuestionCreate, QuestionUpdate, QuestionType } from '../models';
import { AppError } from '../utils/errors';

/**
 * Service for managing questions used in the game
 */
export class QuestionService {
  private questionRepository: QuestionRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  /**
   * Create a new question
   * @param questionData Question data
   * @returns Created question
   */
  async createQuestion(questionData: QuestionCreate): Promise<Question> {
    // Validate question type
    this.validateQuestionType(questionData.type);
    
    // Validate that attribute exists
    if (!questionData.attribute) {
      throw new AppError('Question must have an attribute', 400);
    }
    
    return this.questionRepository.create(questionData);
  }

  /**
   * Get a question by ID
   * @param id Question ID
   * @returns Question or throws if not found
   */
  async getQuestionById(id: string): Promise<Question> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new AppError('Question not found', 404);
    }
    return question;
  }

  /**
   * Get all questions
   * @returns Array of all questions
   */
  async getAllQuestions(): Promise<Question[]> {
    return this.questionRepository.findAll();
  }

  /**
   * Get questions by attribute
   * @param attribute Player attribute
   * @returns Array of questions for the attribute
   */
  async getQuestionsByAttribute(attribute: string): Promise<Question[]> {
    return this.questionRepository.findByAttribute(attribute);
  }

  /**
   * Get questions by type
   * @param type Question type
   * @returns Array of questions of the specified type
   */
  async getQuestionsByType(type: QuestionType): Promise<Question[]> {
    this.validateQuestionType(type);
    return this.questionRepository.findByType(type);
  }

  /**
   * Update a question
   * @param id Question ID
   * @param questionData Question update data
   * @returns Updated question
   */
  async updateQuestion(id: string, questionData: QuestionUpdate): Promise<Question> {
    const question = await this.getQuestionById(id);
    
    // Validate question type if provided
    if (questionData.type) {
      this.validateQuestionType(questionData.type);
    }
    
    return this.questionRepository.update(id, questionData);
  }

  /**
   * Delete a question
   * @param id Question ID
   * @returns True if deleted
   */
  async deleteQuestion(id: string): Promise<boolean> {
    const question = await this.getQuestionById(id);
    return this.questionRepository.delete(id);
  }

  /**
   * Get random questions for a game
   * @param count Number of questions to retrieve (default: 10)
   * @returns Array of random questions
   */
  async getRandomQuestionsForGame(count: number = 10): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    
    // Ensure we have enough questions
    if (allQuestions.length <= count) {
      return allQuestions;
    }
    
    // Randomly select questions
    const selectedQuestions: Question[] = [];
    const availableQuestions = [...allQuestions];
    
    // Try to get a good mix of question types
    const booleanQuestions = availableQuestions.filter(q => q.type === QuestionType.BOOLEAN);
    const multipleChoiceQuestions = availableQuestions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
    const textQuestions = availableQuestions.filter(q => q.type === QuestionType.TEXT);
    
    // Allocate questions by type
    // 60% boolean, 30% multiple choice, 10% text (or similar distribution)
    const booleanCount = Math.floor(count * 0.6);
    const multipleChoiceCount = Math.floor(count * 0.3);
    const textCount = count - booleanCount - multipleChoiceCount;
    
    this.addRandomQuestions(selectedQuestions, booleanQuestions, booleanCount);
    this.addRandomQuestions(selectedQuestions, multipleChoiceQuestions, multipleChoiceCount);
    this.addRandomQuestions(selectedQuestions, textQuestions, textCount);
    
    // If we don't have enough of one type, fill with others
    const remaining = count - selectedQuestions.length;
    if (remaining > 0) {
      // Filter out questions already selected
      const selectedIds = selectedQuestions.map(q => q.id);
      const remainingQuestions = availableQuestions.filter(q => !selectedIds.includes(q.id));
      this.addRandomQuestions(selectedQuestions, remainingQuestions, remaining);
    }
    
    return selectedQuestions;
  }

  /**
   * Get all question attributes
   * @returns Array of attribute names
   */
  async getQuestionAttributes(): Promise<string[]> {
    const questions = await this.getAllQuestions();
    const attributes = new Set<string>();
    
    questions.forEach(question => {
      if (question.attribute) {
        attributes.add(question.attribute);
      }
    });
    
    return Array.from(attributes);
  }

  /**
   * Validate that a question type is valid
   * @param type Question type to validate
   * @throws AppError if invalid
   */
  private validateQuestionType(type: string): void {
    const validTypes = Object.values(QuestionType);
    if (!validTypes.includes(type as QuestionType)) {
      throw new AppError(`Invalid question type. Must be one of: ${validTypes.join(', ')}`, 400);
    }
  }

  /**
   * Helper to add random questions from a source array
   * @param target Target array to add to
   * @param source Source array to select from
   * @param count Number of questions to add
   */
  private addRandomQuestions(target: Question[], source: Question[], count: number): void {
    const shuffled = [...source].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, source.length));
    target.push(...selected);
  }
} 