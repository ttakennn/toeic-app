import { Difficulty } from '@/enums/core.enum';

export interface Phrase {
  id: number;
  image: string;
  audio: string;
  english: string;
  vietnamese: string;
  phonetic?: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface PhrasesCategory {
  title: string;
  description: string;
  data: Phrase[];
  totalItems: number;
}

export interface PhraseCategoryResponse {
  success: boolean;
  category: string;
  title: string;
  description: string;
  data: Phrase[];
  totalItems: number;
  timestamp: string;
}
