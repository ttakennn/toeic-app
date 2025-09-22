export interface Description {
  key: string;
  item: string;
}

export interface GuideItem {
  key: string;
  title: string;
  description: Description[];
}

export interface TestSummary {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  available: boolean;
  description?: string;
}

export interface PracticeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalTests: number;
  availableTests: number;
  tests: TestSummary[];
}
