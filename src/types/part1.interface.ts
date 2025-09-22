import { PracticeCategory } from './core.interface';

export interface Part1PhraseCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  bgColor: string;
  progress: number;
}

export interface Part1PhraseCategoriesResponse {
  success: boolean;
  categories: Part1PhraseCategory[];
  totalCategories: number;
  timestamp: string;
}

export interface Part1PracticeQuestionsResponse {
  success: boolean;
  categories: PracticeCategory[];
  totalCategories: number;
  totalTests: number;
  totalAvailable: number;
  completionRate: number;
  timestamp: string;
}
