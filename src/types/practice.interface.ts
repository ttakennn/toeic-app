export interface PracticeArea {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  totalTests: string;
  difficulty: string;
}

export interface PracticeStats {
  title: string;
  value: string;
  color: string;
}

export interface PracticeData {
  title: string;
  description: string;
  areas: PracticeArea[];
  stats: PracticeStats[];
}

export interface PracticeHeader {
  title: string;
  description: string;
  partType: string;
  totalTests: number;
  totalPoints: number;
}

export interface PracticeTitle {
  title: string;
  icon: React.ReactNode;
  content?: string;
}
