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
  icon: string;
  color: string;
  bgColor: string;
  progress: number;
  data: PhraseData[];
}

type PhrasesDataType = {
  [key: string]: CategoryData;
};

const typedPhrasesData = phrasesData as PhrasesDataType;

export async function GET() {
  try {
    // Optional small delay to help visual loading states
    await new Promise((resolve) => setTimeout(resolve, 300));

    const categories = Object.keys(typedPhrasesData).map((key) => {
      const category = typedPhrasesData[key];

      return {
        id: key,
        title: category.title,
        description: category.description,
        icon: category.icon,
        color: category.color,
        bgColor: category.bgColor,
        // count must reflect the exact number of items in phrases.json
        count: category.data.length,
        progress: category.progress,
      };
    });

    return NextResponse.json({
      success: true,
      categories,
      totalCategories: categories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Part 1 categories:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch Part 1 phrase categories',
      },
      { status: 500 },
    );
  }
}
