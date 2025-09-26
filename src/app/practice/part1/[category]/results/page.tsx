'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Card, CardContent, Grid, Stack } from '@mui/material';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { ResultsData } from '@/types/result.interface';
import LoadTestError from '@/UI/test/load-test-error';
import LoadResult from '@/UI/result/load-result';
import HeaderTestResult from '@/UI/result/header-test-result';
import HeaderScoreResult from '@/UI/result/header-score-result';
import HeaderMessageResult from '@/UI/result/header-message-result';
import QuestionDetailResult from '@/UI/result/question-detail-result';
import SummaryResult from '@/UI/result/summary-result';
import ActionResult from '@/UI/result/action-result';
import FixedNavigationMobileResult from '@/UI/result/fixed-navigation-mobile-result';

function ResultsContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const testId = parseInt(searchParams.get('testId') || '1');

  // Results States
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigate to review page
  const handleQuestionClick = (questionId: number) => {
    router.push(`/practice/part1/${category}/review?testId=${testId}&questionId=${questionId}`);
  };

  // Load results from sessionStorage
  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate category
        const validCategories = ['basic', 'advanced', 'simulation', 'mixed'];
        if (!validCategories.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }

        // Load from sessionStorage
        const resultsKey = `part1_test_results_${category}_${testId}`;
        const storedResults = sessionStorage.getItem(resultsKey);

        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          setResults(parsedResults);
        } else {
          throw new Error('Không tìm thấy dữ liệu bài test. Vui lòng làm lại bài test.');
        }
      } catch (error) {
        console.error('Error loading results:', error);
        setError(error instanceof Error ? error.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (category && testId) {
      loadResults();
    }
  }, [category, testId]);

  if (loading) {
    return <LoadResult />;
  }

  if (error || !results) {
    return <LoadTestError error={error} href="/practice/part1" />;
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 0, md: 3 } }}>
        {/* Header với kết quả tổng quan */}
        <Card
          sx={{
            mb: 2,
            background: `linear-gradient(135deg, ${results.categoryInfo?.color || '#1976d2'}20 0%, ${
              results.categoryInfo?.color || '#1976d2'
            }10 100%)`,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <HeaderTestResult
              category={category}
              title={results.testInfo?.title || 'Test Part 1'}
              color={results.categoryInfo?.color || '#1976d2'}
              score={results.score || 0}
            />
            <HeaderScoreResult
              correctCount={results.correctCount || 0}
              totalQuestions={results.totalQuestions || 0}
              timeSpent={results.timeSpent || 0}
              score={results.score || 0}
              color={results.categoryInfo?.color || '#1976d2'}
            />
            <HeaderMessageResult score={results.score || 0} color={results.categoryInfo?.color || '#1976d2'} />
          </CardContent>
        </Card>

        <Grid container spacing={{ xs: 2, md: 2 }}>
          {/* Chi tiết từng câu hỏi */}
          <QuestionDetailResult
            color={results.categoryInfo?.color || '#1976d2'}
            title={results.categoryInfo.title}
            results={results.questionResults}
            handleQuestionClick={handleQuestionClick}
          />
          {/* Thống kê và hành động */}
          <Grid size={{ xs: 12, md: 4 }} order={{ xs: 2, md: 2 }}>
            <Stack spacing={3}>
              <SummaryResult results={results} />
              <ActionResult
                reworkHref={`/practice/part1/${category}/test?testId=${testId}`}
                reviewHref={`/practice/part1`}
                results={results}
              />
            </Stack>
          </Grid>
        </Grid>
        {/* Fixed Navigation for Mobile */}
        <FixedNavigationMobileResult
          color={results.categoryInfo?.color || '#1976d2'}
          reworkHref={`/practice/part1/${category}/test?testId=${testId}`}
          reviewHref={`/practice/part1`}
        />
      </Box>
    </DashboardLayout>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadResult />}>
      <ResultsContent />
    </Suspense>
  );
}
