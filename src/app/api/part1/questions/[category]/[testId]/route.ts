import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface TestQuestion {
  id: number;
  imageUrl: string;
  audioUrl: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  theme: string;
  vocabulary: string[];
}

interface TestInfo {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  category: string;
  description: string;
}

interface TestData {
  testInfo: TestInfo;
  questions: TestQuestion[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; testId: string }> }
) {
  try {
    const { category, testId } = await params;
    
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

    // Validate testId
    const testIdNumber = parseInt(testId);
    if (isNaN(testIdNumber) || testIdNumber < 1) {
      return NextResponse.json(
        {
          error: 'Invalid test ID',
          message: 'Test ID must be a positive number',
        },
        { status: 400 }
      );
    }

    // Read test data file
    const filePath = path.join(process.cwd(), 'src', 'data', 'part1', 'questions', category, `test${testId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error: 'Test not found',
          message: `Test ${testId} not found in category ${category}`,
        },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const testData: TestData = JSON.parse(fileContent);

    // Optional small delay to help visual loading states
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: testData,
      category,
      testId: testIdNumber,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching test data:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch test data',
      },
      { status: 500 }
    );
  }
}
