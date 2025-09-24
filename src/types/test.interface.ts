import { PracticeCategory, TestSummary } from './core.interface';

export interface QuestionTranslation {
  id: number;
  question: string;
  en: string;
  vi: string;
}

export interface TestQuestion {
  id: number;
  imageUrl: string;
  audioUrl: string;
  questions: QuestionTranslation[];
  correctAnswer: string;
  explanation: string;
  theme: string;
  vocabulary: string[];
}

export interface TestInfo {
  id: number;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  duration: string;
  questions: number;
}

export interface TestData {
  testInfo: TestInfo;
  questions: TestQuestion[];
  correctCount: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
}

export interface TestApiResponse {
  success: boolean;
  data: TestData;
  category: string;
  testId: number;
  timestamp: string;
}

export interface TestCategoryResponse {
  success: true;
  category: PracticeCategory;
  tests: TestSummary[];
  availableCount: number;
  totalCount: number;
  timestamp: string;
}
