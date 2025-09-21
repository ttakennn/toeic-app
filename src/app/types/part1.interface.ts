import { HeaderSectionPart } from "./header-section-part.interface";

export interface Part1TestSummary {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  available: boolean;
  description?: string;
}

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

export interface Part1PracticeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalTests: number;
  availableTests: number;
  tests: Part1TestSummary[];
}

export interface Part1PhraseCategoriesResponse {
  success: boolean;
  categories: Part1PhraseCategory[];
  totalCategories: number;
  timestamp: string;
}

export interface Part1PracticeQuestionsResponse {
  success: boolean;
  categories: Part1PracticeCategory[];
  header: HeaderSectionPart;
  totalCategories: number;
  totalTests: number;
  totalAvailable: number;
  completionRate: number;
  timestamp: string;
}
