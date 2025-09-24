import { PracticeCategory } from './core.interface';
import { TestInfo } from './test.interface';

export interface QuestionResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  uniqueKey: string;
}

export interface ResultsData {
  testInfo: TestInfo;
  categoryInfo: PracticeCategory;
  questionResults: QuestionResult[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
  submittedAt: string;
  uniqueKey: string;
}
