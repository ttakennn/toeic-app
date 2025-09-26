'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Card, CardContent, Grid, Stack } from '@mui/material';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { getPart1TestCategory } from '@/actions/part1/part1-test';
import { getPart1TestCategoryByTestId } from '@/actions/part1/part1-test';
import { PracticeCategory } from '@/types/core.interface';
import { ResultsData } from '@/types/result.interface';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { TestData } from '@/types/test.interface';
import LoadTestError from '@/UI/test/load-test-error';
import LoadTest from '@/UI/test/load-test';
import HeaderCardReview from '@/UI/review/header-card-review';
import HeaderNavigationReview from '@/UI/review/header-navigation-review';
import CardImageReview from '@/UI/review/card-image-review';
import CardQuestionsContentReview from '@/UI/review/card-questions-content-review';
import CardExplainReview from '@/UI/review/card-explain-review';
import LoadResult from '@/UI/result/load-result';
import FixedNavigationMobileReview from '@/UI/review/fixed-navigation-mobile-review';

function ReviewContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const testId = parseInt(searchParams.get('testId') || '1');
  const initialQuestionId = parseInt(searchParams.get('questionId') || '1');

  // API States
  const [testData, setTestData] = useState<TestData | null>(null);
  const [categoryData, setCategoryData] = useState<PracticeCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review States
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestionId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<ResultsData | null>(null);

  // Navigation handler
  const handleBackToResults = useCallback(() => {
    router.push(`/practice/part1/${category}/results?testId=${testId}`);
  }, [category, testId, router]);

  const handleNextQuestion = useCallback(() => {
    if (testData && currentQuestion < testData.questions.length) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      router.replace(`/practice/part1/${category}/review?testId=${testId}&questionId=${nextQuestion}`);
    }
  }, [category, testId, router, testData, currentQuestion]);

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestion > 1) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      router.replace(`/practice/part1/${category}/review?testId=${testId}&questionId=${prevQuestion}`);
    }
  }, [category, testId, router, currentQuestion]);

  // Load test data from API
  useEffect(() => {
    const loadTestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate category
        const validCategories = ['basic', 'advanced', 'simulation', 'mixed'];
        if (!validCategories.includes(category)) {
          throw new Error(`Invalid category: ${category}`);
        }

        // Fetch test data
        const [testData, categoryData] = await Promise.all([
          getPart1TestCategoryByTestId(category, testId),
          getPart1TestCategory(category),
        ]);

        setTestData(testData.data);
        setCategoryData(categoryData.category);
      } catch (error) {
        console.error('Error loading test data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load test data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (category && testId) {
      loadTestData();
    }
  }, [category, testId]);

  // Load user answers from sessionStorage
  useEffect(() => {
    try {
      // Try to load from new structure first
      const resultsKey = `part1_test_results_${category}_${testId}`;
      const storedResults = sessionStorage.getItem(resultsKey);

      if (storedResults) {
        const parsedResults = JSON.parse(storedResults);
        // Extract user answers from questionResults
        const answersMap: { [key: number]: string } = {};
        parsedResults.questionResults?.forEach((result: { questionId: number; userAnswer: string }) => {
          if (result.userAnswer && result.userAnswer !== 'Không trả lời') {
            answersMap[result.questionId] = result.userAnswer;
          }
        });
        setUserAnswers(answersMap);
        setResults(parsedResults);
      } else {
        // Fallback to old structure
        const storedAnswers = sessionStorage.getItem(`test_answers_${category}_${testId}`);
        if (storedAnswers) {
          const parsedAnswers = JSON.parse(storedAnswers);
          setUserAnswers(parsedAnswers);
        }
      }
    } catch (error) {
      console.error('Error loading user answers:', error);
    }
  }, [category, testId]);

  // Validate and set initial question based on URL questionId after testData loads
  useEffect(() => {
    if (testData && testData.questions.length > 0) {
      // Validate initialQuestionId is within valid range
      if (initialQuestionId >= 1 && initialQuestionId <= testData.questions.length) {
        setCurrentQuestion(initialQuestionId);
      } else {
        // If invalid questionId, default to 1
        console.warn(`Invalid questionId: ${initialQuestionId}. Defaulting to question 1.`);
        setCurrentQuestion(1);
      }
    }
  }, [testData, initialQuestionId]);

  // Reset translation state when changing question
  useEffect(() => {
    setShowTranslation(false);
  }, [currentQuestion]);

  if (loading) {
    return <LoadTest text="Đang tải câu hỏi..." />;
  }

  if (error || !testData || !categoryData || !results) {
    return <LoadTestError error={error} href="/practice/part1" />;
  }

  const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 0, sm: 2 } }}>
        {/* Header */}
        <HeaderCardReview
          color={categoryData.color}
          title={testData.testInfo.title}
          category={category}
          correctCount={results.correctCount}
          totalQuestions={results.totalQuestions}
          score={results.score}
        />
        {/* Navigation */}
        <HeaderNavigationReview
          color={categoryData.color}
          currentQuestion={currentQuestion}
          testQuestionLength={testData.questions.length}
          handleBackToResults={handleBackToResults}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
        />
        <Grid container spacing={{ xs: 2, md: 2 }}>
          {/* Phần hình ảnh và audio */}
          <Grid size={{ xs: 12, md: 6 }}>
            {currentQuestionData && (
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <CardImageReview
                    color={categoryData.color}
                    theme={currentQuestionData.theme}
                    currentQuestion={currentQuestion}
                    difficulty={testData.testInfo.difficulty}
                    imageUrl={currentQuestionData.imageUrl}
                  />
                  {/* Audio Progress Slider */}
                  <AudioPlayer
                    color={categoryData.color}
                    audioUrl={currentQuestionData.audioUrl}
                    autoPlay={isPlaying}
                    onEnded={() => setIsPlaying(false)}
                    onError={(error) => console.error('Audio playback error:', error)}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Phần đáp án và giải thích */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              {currentQuestionData && (
                <>
                  {/* Các lựa chọn */}
                  <CardQuestionsContentReview
                    color={categoryData.color}
                    currentQuestionData={currentQuestionData}
                    showTranslation={showTranslation}
                    userAnswers={userAnswers}
                    setShowTranslation={setShowTranslation}
                  />
                  {/* Giải thích */}
                  <CardExplainReview color={categoryData.color} currentQuestionData={currentQuestionData} />
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Fixed Navigation for Mobile */}
        <FixedNavigationMobileReview
          color={categoryData.color}
          currentQuestion={currentQuestion}
          testQuestionLength={testData.questions.length}
          linkToFinish="/practice/part1"
          handleBackToResults={handleBackToResults}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
        />

        {/* Add padding bottom to prevent content being hidden behind fixed nav */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, height: 80 }} />
      </Box>
    </DashboardLayout>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<LoadResult text="Đang tải câu hỏi..." />}>
      <ReviewContent />
    </Suspense>
  );
}
