import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  params: Promise<{
    category: string;
    testId: string;
  }>;
}

interface Question {
  id: number;
  audioUrl: string;
  correctAnswer: string;
  explanation: string;
  questionTranscript: string;
  optionA_Transcript: string;
  optionB_Transcript: string;
  optionC_Transcript: string;
  theme: string;
  difficulty: string;
  vocabulary: string[];
}

interface TestData {
  testInfo: {
    id: number;
    title: string;
    difficulty: string;
    questions: number;
    duration: string;
    category: string;
    description: string;
  };
  questions: Question[];
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { category, testId } = await params;

    // Validate parameters
    if (!category || !testId) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Category and testId are required',
        },
        { status: 400 }
      );
    }

    // Parse testId to number
    const testNumber = parseInt(testId);
    if (isNaN(testNumber) || testNumber < 1) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid testId format',
        },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = path.join(
      process.cwd(),
      'src',
      'data',
      'part2',
      'questions',
      category,
      `test${testNumber}.json`
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Test ${testNumber} for category ${category} not found`,
        },
        { status: 404 }
      );
    }

    // Read and parse the test file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const testData: TestData = JSON.parse(fileContent);

    // Validate the test data structure
    if (!testData.testInfo || !testData.questions || !Array.isArray(testData.questions)) {
      throw new Error('Invalid test data structure');
    }

    // Optional small delay to help visual loading states
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: testData,
      category,
      testId: testNumber,
      totalQuestions: testData.questions.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`Error fetching Part 2 test data:`, error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'Invalid test data format',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch test data',
      },
      { status: 500 }
    );
  }
}
