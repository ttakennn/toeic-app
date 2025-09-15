import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import practiceItemsData from '@/data/part2/practiceItems.json';

interface TestSummary {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  available: boolean;
}

interface CategoryWithTests {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalTests: number;
  availableTests: number;
  tests: TestSummary[];
}

export async function GET() {
  try {
    const categories: CategoryWithTests[] = [];

    // Process each category
    for (const categoryInfo of practiceItemsData.practiceItems) {
      const categoryDir = path.join(process.cwd(), 'src', 'data', 'part2', 'questions', categoryInfo.id);
      const tests: TestSummary[] = [];
      let availableCount = 0;

      // Check each test file
      for (const test of categoryInfo.tests) {
        const filePath = path.join(categoryDir, `test${test.id}.json`);
        const available = fs.existsSync(filePath);
        
        if (available) {
          availableCount++;
        }

        tests.push({
          id: test.id,
          title: test.title,
          difficulty: test.difficulty,
          questions: test.questions,
          duration: test.duration,
          available,
        });
      }

      categories.push({
        id: categoryInfo.id,
        title: categoryInfo.title,
        description: categoryInfo.description,
        icon: categoryInfo.icon,
        color: categoryInfo.color,
        bgColor: categoryInfo.bgColor,
        totalTests: categoryInfo.totalTests,
        availableTests: availableCount,
        tests,
      });
    }

    // Optional small delay to help visual loading states
    await new Promise(resolve => setTimeout(resolve, 100));

    // Calculate totals
    const totalTests = categories.reduce((sum, cat) => sum + cat.totalTests, 0);
    const totalAvailable = categories.reduce((sum, cat) => sum + cat.availableTests, 0);

    return NextResponse.json({
      success: true,
      categories,
      totalCategories: categories.length,
      totalTests,
      totalAvailable,
      completionRate: totalTests > 0 ? Math.round((totalAvailable / totalTests) * 100) : 0,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching Part 2 questions data:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch Part 2 questions overview',
      },
      { status: 500 }
    );
  }
}
