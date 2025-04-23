// Question related models and types

export interface Question {
  id: string;
  text: string;
  trait: string;
  expectedValues: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionCreate {
  text: string;
  trait: string;
  expectedValues: string[];
  category: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  questions: Question[];
} 