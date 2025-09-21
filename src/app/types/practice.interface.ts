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
