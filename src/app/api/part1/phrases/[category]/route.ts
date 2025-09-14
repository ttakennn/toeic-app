import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // Simulate network delay for loading state demonstration
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { category } = await params;
    
    // Check if category exists
    if (!typedPhrasesData[category]) {
      return NextResponse.json(
        { 
          error: 'Category not found',
          message: `Category '${category}' does not exist.`,
          availableCategories: Object.keys(typedPhrasesData)
        },
        { status: 404 }
      );
    }

    const categoryData = typedPhrasesData[category];

    // Process images - use placeholder if empty
    const processedData = {
      ...categoryData,
      data: categoryData.data.map(phrase => ({
        ...phrase,
        image: phrase.image || '/images/placeholder/toeic-placeholder.svg'
      }))
    };

    return NextResponse.json({
      success: true,
      category,
      ...processedData,
      totalItems: processedData.data.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching phrases:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to fetch phrase data'
      },
      { status: 500 }
    );
  }
}

// GET all available categories
export async function OPTIONS() {
  try {
    const categories = Object.keys(typedPhrasesData).map(key => ({
      key,
      title: typedPhrasesData[key].title,
      description: typedPhrasesData[key].description,
      itemCount: typedPhrasesData[key].data.length
    }));

    return NextResponse.json({
      success: true,
      categories,
      totalCategories: categories.length
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