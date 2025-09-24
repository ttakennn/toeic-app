'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Card, CardContent, Grid, Stack, Chip, CircularProgress } from '@mui/material';
import { Timer } from '@mui/icons-material';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { TestData } from '@/types/test.interface';
import PreTestScreen from '@/UI/test/pre-test-screen';
import LoadTestError from '@/UI/test/load-test-error';
import LoadTest from '@/UI/test/load-test';
import TopProgress from '@/UI/top-progress';
import ImageSectionTest from '@/UI/test/image-section-test';
import TestAnswerOption from '@/components/practice/part1/test/test-answer-option';
import { AudioPlayer } from '@/components/audio';
import TestNavigationButton from '@/components/practice/part1/test/test-navigation-button';
import TestFinishDialog from '@/components/practice/part1/test/test-finish-dialog';
import { getPart1TestCategory, getPart1TestCategoryByTestId } from '@/actions/part1/part1-test';
import { PracticeCategory } from '@/types/core.interface';
import { QuestionResult, ResultsData } from '@/types/result.interface';
import { CommonUtil } from '@/utils/common.util';

function TestContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const category = params.category as string;
  const testId = parseInt(searchParams.get('testId') || '1');

  // API States
  const [testData, setTestData] = useState<TestData | null>(null);
  const [categoryData, setCategoryData] = useState<PracticeCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test States
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

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

        // Set timer but don't start countdown yet
        const timeInMinutes = parseInt(testData.data.testInfo.duration.split(' ')[0]);
        setTimeLeft(timeInMinutes * 60);
      } catch (error) {
        console.error('Error loading test data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load test data');
      } finally {
        setLoading(false);
      }
    };

    if (category && testId) {
      loadTestData();
    }
  }, [category, testId]);

  // Timer countdown (only start after test is started)
  useEffect(() => {
    if (timeLeft > 0 && testData && testStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testData && testStarted) {
      handleFinishTest();
    }
  }, [timeLeft, testData, testStarted]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (testData && currentQuestion < testData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleStartTest = async () => {
    // Start the test
    setTestStarted(true);
  };

  const handleFinishTest = () => {
    setShowFinishDialog(true);
  };

  const handleClickViewResults = () => {
    const testQuestion = testData?.questions;
    const duration = testData?.testInfo.duration;
    const testInfo = testData?.testInfo;

    if (!testQuestion || !duration || !testInfo || !categoryData) {
      return;
    }

    const uniqueKey = `part1_${category}_${testId}_${Date.now()}`;

    // Calculate results with new structure
    let correctCount = 0;
    const questionResults: QuestionResult[] = testQuestion.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        userAnswer: userAnswer || 'Không trả lời',
        correctAnswer: question.correctAnswer,
        isCorrect,
        uniqueKey: `${uniqueKey}_q${question.id}`,
      };
    });

    const score = Math.round((correctCount / testQuestion.length) * 100);
    const timeSpent = Math.max(0, parseInt(duration.split(' ')[0]) * 60 - timeLeft);

    // Store results in sessionStorage with comprehensive structure
    const resultsData: ResultsData = {
      testInfo: testInfo,
      categoryInfo: categoryData,
      questionResults,
      score,
      correctCount,
      totalQuestions: testQuestion.length,
      timeSpent,
      submittedAt: new Date().toISOString(),
      uniqueKey,
    };

    console.log('Storing Part 1 results to sessionStorage:', resultsData);

    // Store in sessionStorage using single key like Part 2
    sessionStorage.setItem(`part1_test_results_${category}_${testId}`, JSON.stringify(resultsData));

    // Chuyển hướng đến results page
    window.location.href = `/practice/part1/${category}/results?testId=${testId}`;
  };

  if (loading) {
    return <LoadTest />;
  }

  if (error || !testData || !categoryData) {
    return <LoadTestError error={error} href="/practice/part1" />;
  }

  // Pre-test screen
  if (!testStarted) {
    return (
      <PreTestScreen
        category={category}
        categoryData={categoryData}
        testData={testData}
        handleStartTest={handleStartTest}
      />
    );
  }

  const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);
  const answeredCount = Object.keys(answers).length;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 1, sm: 2 }, pb: { xs: 9, sm: 10 } }}>
        {/* Layout */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ position: 'relative' }}>
              <TopProgress
                currentIndex={currentQuestion}
                lengthData={testData.questions.length}
                color={categoryData.color}
              />
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: categoryData.color,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                      }}
                    >
                      {testData.testInfo.title} {currentQuestion}/{testData.questions.length}
                    </Typography>
                  </Stack>
                  <Chip
                    icon={<Timer />}
                    label={CommonUtil.formatTime(timeLeft)}
                    color={timeLeft <= 60 ? 'error' : timeLeft <= 180 ? 'warning' : 'primary'}
                    variant="filled"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}
                  />
                </Stack>

                {/* Responsive layout: mobile stacked, desktop side-by-side */}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <ImageSectionTest
                      imageUrl={currentQuestionData?.imageUrl || ''}
                      currentQuestion={currentQuestion}
                    />
                    {currentQuestionData?.audioUrl && (
                      <AudioPlayer
                        autoPlay={true}
                        showControls={false}
                        disabled={false}
                        audioUrl={currentQuestionData.audioUrl}
                        color={categoryData.color}
                        onError={(error) => console.error('Audio playback error:', error)}
                      />
                    )}
                  </Grid>

                  {/* Controls and answers section */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    {/* Answer options */}
                    <Box sx={{ mb: { xs: 2, md: 4 } }}>
                      <TestAnswerOption
                        categoryData={categoryData}
                        answers={answers}
                        currentQuestion={currentQuestion}
                        handleAnswerSelect={handleAnswerSelect}
                      />
                    </Box>
                    {/* Navigation buttons */}
                    <TestNavigationButton
                      color={categoryData.color}
                      currentQuestion={currentQuestion}
                      testQuestionLength={testData.questions.length}
                      handlePrevQuestion={handlePrevQuestion}
                      handleNextQuestion={handleNextQuestion}
                      handleFinishTest={handleFinishTest}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog kết thúc test */}
        <TestFinishDialog
          title={testData.testInfo.title}
          duration={testData.testInfo.duration}
          answeredCount={answeredCount}
          timeLeft={timeLeft}
          answers={answers}
          testQuestion={testData.questions}
          categoryData={categoryData}
          showFinishDialog={showFinishDialog}
          setShowFinishDialog={setShowFinishDialog}
          onClickViewResults={handleClickViewResults}
        />
      </Box>
    </DashboardLayout>
  );
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải bài test...
            </Typography>
          </Box>
        </DashboardLayout>
      }
    >
      <TestContent />
    </Suspense>
  );
}
