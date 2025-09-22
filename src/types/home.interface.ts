export interface Welcome {
  title: string;
  description: string;
}

export interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export interface QuickAccess {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
}

export interface HomeData {
  welcome: Welcome;
  stats: Stat[];
  quickAccess: QuickAccess[];
}
