import { NextResponse } from 'next/server';
import phrasesData from '@/data/part1/phrases.json';

interface PhraseData {
  id: number;
  image: string;
  audio: string;
  english: string;
  vietnamese: string;
  phonetic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface CategoryData {
  title: string;
  description: string;
  data: PhraseData[];
}

type PhrasesDataType = {
  [key: string]: CategoryData;
};

const typedPhrasesData = phrasesData as PhrasesDataType;

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const categories = Object.keys(typedPhrasesData).map(key => ({
      key,
      title: typedPhrasesData[key].title,
      description: typedPhrasesData[key].description,
      itemCount: typedPhrasesData[key].data.length,
      difficulty: {
        easy: typedPhrasesData[key].data.filter(item => item.difficulty === 'easy').length,
        medium: typedPhrasesData[key].data.filter(item => item.difficulty === 'medium').length,
        hard: typedPhrasesData[key].data.filter(item => item.difficulty === 'hard').length,
      }
    }));

    return NextResponse.json({
      success: true,
      categories,
      totalCategories: categories.length,
      totalItems: categories.reduce((sum, cat) => sum + cat.itemCount, 0),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch categories'
      },
      { status: 500 }
    );
  }
}
