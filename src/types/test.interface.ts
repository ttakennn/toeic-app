import { GuideItem } from './core.interface';

export interface TestQuestion {
  id: number;
  imageUrl: string;
  audioUrl: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  theme: string;
  vocabulary: string[];
}

export interface TestInfo {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  guides: GuideItem;
}

export interface TestData {
  testInfo: TestInfo;
  questions: TestQuestion[];
}

export interface TestApiResponse {
  success: boolean;
  data: TestData;
  category: string;
  testId: number;
  timestamp: string;
}
