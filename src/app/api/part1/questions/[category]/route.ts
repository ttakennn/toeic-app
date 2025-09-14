import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import practiceItemsData from '@/data/part1/questions/practiceItems.json';


interface TestSummary {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  available: boolean;
  description?: string;
}

interface CategoryInfo {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalTests: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    
    // Validate category
    const validCategories = ['basic', 'advanced', 'simulation', 'mixed'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          error: 'Invalid category',
          message: `Category must be one of: ${validCategories.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get category info from practiceItems
    const categoryInfo = practiceItemsData.practiceItems.find(item => item.id === category);
    if (!categoryInfo) {
      return NextResponse.json(
        {
          error: 'Category not found',
          message: `Category ${category} not found in practice items`,
        },
        { status: 404 }
      );
    }

    // Get available test files
    const categoryDir = path.join(process.cwd(), 'src', 'data', 'part1', 'questions', category);
    const availableTests: TestSummary[] = [];

    // Check each expected test file
    for (const test of categoryInfo.tests) {
      const filePath = path.join(categoryDir, `test${test.id}.json`);
      let testDescription = '';
      let available = false;

      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const testData = JSON.parse(fileContent);
          testDescription = testData.testInfo?.description || '';
          available = true;
        } catch (error) {
          console.warn(`Error reading test file ${filePath}:`, error);
        }
      }

      availableTests.push({
        id: test.id,
        title: test.title,
        difficulty: test.difficulty,
        questions: test.questions,
        duration: test.duration,
        available,
        description: testDescription,
      });
    }

    // Optional small delay to help visual loading states
    await new Promise(resolve => setTimeout(resolve, 150));

    const categoryResponse: CategoryInfo = {
      id: categoryInfo.id,
      title: categoryInfo.title,
      description: categoryInfo.description,
      icon: categoryInfo.icon,
      color: categoryInfo.color,
      bgColor: categoryInfo.bgColor,
      totalTests: categoryInfo.totalTests,
    };

    return NextResponse.json({
      success: true,
      category: categoryResponse,
      tests: availableTests,
      availableCount: availableTests.filter(test => test.available).length,
      totalCount: availableTests.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching category tests:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch category tests',
      },
      { status: 500 }
    );
  }
}
