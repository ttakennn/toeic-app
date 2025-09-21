'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Home,
  Refresh,
  TrendingUp,
  Error as ErrorIcon,
  Star,
  Timer,
  QuestionAnswer,
  Help,
} from '@mui/icons-material';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface TestApiResponse {
  success: boolean;
  data: TestData;
  category: string;
  testId: number;
  timestamp: string;
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

interface QuestionResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  uniqueKey: string;
}

interface TestResults {
  testInfo: TestInfo;
  categoryInfo: CategoryInfo;
  questionResults: QuestionResult[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
  submittedAt: string;
  uniqueKey: string;
}

const getCategoryEmoji = (categoryId: string) => {
  switch (categoryId) {
    case 'basic':
      return '🎯';
    case 'advanced':
      return '🌄';
    case 'simulation':
      return '🔧';
    case 'mixed':
      return '🤝';
    default:
      return '📝';
  }
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const testId = parseInt(searchParams.get('testId') || '1');

  // Results States
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Legacy support for backward compatibility
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Navigation handler
  const handleQuestionClick = (questionId: number) => {
    // Save current results to sessionStorage for review page
    sessionStorage.setItem(`test_answers_${category}_${testId}`, JSON.stringify(userAnswers));
    sessionStorage.setItem(`test_time_spent_${category}_${testId}`, timeSpent.toString());

    // Navigate to review page with specific question
    router.push(`/practice/part1/${category}/review?testId=${testId}&questionId=${questionId}`);
  };

  const getCategoryInfo = (categoryId: string): CategoryInfo => {
    const categoryMap: { [key: string]: CategoryInfo } = {
      basic: {
        id: 'basic',
        title: 'Cụm từ tả người',
        description: 'Học các cụm từ mô tả người và hoạt động của con người',
        icon: '/images/categories/people-icon.svg',
        color: '#4caf50',
        bgColor: '#e8f5e8',
        totalTests: 5,
      },
      advanced: {
        id: 'advanced',
        title: 'Cụm từ tả cảnh',
        description: 'Các cụm từ mô tả cảnh quan và môi trường',
        icon: '/images/categories/scene-icon.svg',
        color: '#f44336',
        bgColor: '#ffebee',
        totalTests: 4,
      },
      simulation: {
        id: 'simulation',
        title: 'Cụm từ tả vật',
        description: 'Mô tả các đồ vật và thiết bị',
        icon: '/images/categories/object-icon.svg',
        color: '#2196f3',
        bgColor: '#e3f2fd',
        totalTests: 4,
      },
      mixed: {
        id: 'mixed',
        title: 'Cụm từ tổng hợp',
        description: 'Tương tác giữa người và môi trường',
        icon: '/images/categories/mixed-icon.svg',
        color: '#ff9800',
        bgColor: '#fff3e0',
        totalTests: 6,
      },
    };
    return categoryMap[categoryId] || categoryMap.basic;
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

        // Try to load from new structure first
        const resultsKey = `part1_test_results_${category}_${testId}`;
        const storedResults = sessionStorage.getItem(resultsKey);

        if (storedResults) {
          // New structure - read directly from sessionStorage
          const parsedResults = JSON.parse(storedResults);
          setResults(parsedResults);

          // Set legacy states for backward compatibility
          const answersMap: { [key: number]: string } = {};
          parsedResults.questionResults?.forEach((result: QuestionResult) => {
            answersMap[result.questionId] = result.userAnswer;
          });
          setUserAnswers(answersMap);
          setTimeSpent(parsedResults.timeSpent || 0);
        } else {
          // Fallback to old structure - load test data from API and calculate
          const response = await fetch(`/api/part1/questions/${category}/${testId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const apiData: TestApiResponse = await response.json();
          if (!apiData.success) {
            throw new Error('Failed to load test data');
          }

          // Load user answers from sessionStorage (old structure)
          const answersKey = `test_answers_${category}_${testId}`;
          const timeKey = `test_time_spent_${category}_${testId}`;

          const savedAnswers = sessionStorage.getItem(answersKey);
          const savedTime = sessionStorage.getItem(timeKey);

          if (savedAnswers) {
            const answers = JSON.parse(savedAnswers);
            setUserAnswers(answers);

            // Calculate score
            let correct = 0;
            apiData.data.questions.forEach((question) => {
              if (answers[question.id] === question.correctAnswer) {
                correct++;
              }
            });
            const calculatedScore = Math.round((correct / apiData.data.questions.length) * 100);

            // Create results structure from legacy data
            const questionResults = apiData.data.questions.map((question) => ({
              questionId: question.id,
              userAnswer: answers[question.id] || 'Không trả lời',
              correctAnswer: question.correctAnswer,
              isCorrect: answers[question.id] === question.correctAnswer,
              uniqueKey: `legacy_part1_${category}_${testId}_q${question.id}`,
            }));

            const legacyResults = {
              testInfo: apiData.data.testInfo,
              categoryInfo: getCategoryInfo(category),
              questionResults,
              score: calculatedScore,
              correctCount: correct,
              totalQuestions: apiData.data.questions.length,
              timeSpent: savedTime ? parseInt(savedTime) : 0,
              submittedAt: new Date().toISOString(),
              uniqueKey: `legacy_part1_${category}_${testId}`,
            };

            setResults(legacyResults);
          } else {
            throw new Error('Không tìm thấy dữ liệu bài test. Vui lòng làm lại bài test.');
          }

          if (savedTime) {
            setTimeSpent(parseInt(savedTime));
          }
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { message: 'Xuất sắc! 🏆', color: '#4caf50' };
    if (score >= 80) return { message: 'Rất tốt! 🌟', color: '#2196f3' };
    if (score >= 70) return { message: 'Tốt! 👍', color: '#ff9800' };
    if (score >= 60) return { message: 'Khá! 📈', color: '#ff5722' };
    return { message: 'Cần cải thiện! 💪', color: '#f44336' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải kết quả...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !results) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Lỗi tải kết quả
            </Typography>
            <Typography variant="body2">{error || 'Không thể tải kết quả bài test. Vui lòng thử lại.'}</Typography>
          </Alert>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" component={Link} href="/practice/part1">
              Về trang chủ
            </Button>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </Stack>
        </Box>
      </DashboardLayout>
    );
  }

  const correctCount = results.correctCount || 0;
  const scoreMessage = getScoreMessage(results.score || 0);

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 0, md: 3 } }}>
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
            <Stack
              direction={{ xs: 'row', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              sx={{ mb: { xs: 2, md: 3 } }}
              spacing={{ xs: 1.25, md: 0 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                    {getCategoryEmoji(category)} Kết quả bài test
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {results.testInfo?.title || 'Test Part 1'}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    backgroundColor: results.categoryInfo?.color || '#1976d2',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                    fontWeight: 'bold',
                    alignSelf: { xs: 'center', sm: 'auto' },
                  }}
                >
                  {results.score || 0}%
                </Avatar>
              </Stack>
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <CheckCircle sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {correctCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Đúng
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Cancel sx={{ fontSize: 30, color: 'error.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {(results.totalQuestions || 0) - correctCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sai
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Timer sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatTime(results.timeSpent || 0)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Thời gian
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Star sx={{ fontSize: 30, color: results.categoryInfo?.color || '#1976d2', mb: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: results.categoryInfo?.color || '#1976d2' }}
                    >
                      {results.score || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Điểm số
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mb: 3, mt: 2 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium', fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                {scoreMessage.message}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={results.score || 0}
                sx={{
                  height: { xs: 10, md: 12 },
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: results.categoryInfo?.color || '#1976d2',
                    borderRadius: 6,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={{ xs: 2, md: 2 }}>
          {/* Chi tiết từng câu hỏi */}
          <Grid size={{ xs: 12, md: 8 }} order={{ xs: 1, md: 1 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: results.categoryInfo.color,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <QuestionAnswer /> Chi tiết từng câu hỏi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  💡 Click vào bất kỳ câu hỏi nào để xem chi tiết và review
                </Typography>
                <Stack spacing={2}>
                  {results.questionResults?.map((result: QuestionResult) => (
                    <Card
                      key={result.questionId}
                      variant="outlined"
                      sx={{
                        border: result.isCorrect ? '2px solid #4caf50' : '2px solid #f44336',
                        backgroundColor: result.isCorrect ? '#f8fff8' : '#fff8f8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                          backgroundColor: result.isCorrect ? '#f0fff0' : '#fff0f0',
                        },
                      }}
                      onClick={() => handleQuestionClick(result.questionId)}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Stack spacing={{ xs: 2, sm: 3 }}>
                          {/* Question Header */}
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Chip
                                label={`Câu ${result.questionId}`}
                                sx={{ backgroundColor: results.categoryInfo?.color || '#1976d2', color: 'white' }}
                              />
                              <Chip label={results.categoryInfo.title} variant="outlined" size="small" />
                            </Stack>
                          </Stack>

                          {/* Question Content */}
                          <Box>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  <strong>Câu trả lời của bạn:</strong>
                                </Typography>
                                <Chip
                                  label={result.userAnswer}
                                  size="small"
                                  sx={{
                                    backgroundColor: result.isCorrect ? 'success.main' : 'error.main',
                                    color: 'white',
                                  }}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  <strong>Đáp án đúng:</strong>
                                </Typography>
                                <Chip
                                  label={result.correctAnswer}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'success.main',
                                    color: 'white',
                                  }}
                                />
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  )) || []}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Thống kê và hành động */}
          <Grid size={{ xs: 12, md: 4 }} order={{ xs: 2, md: 2 }}>
            <Stack spacing={3}>
              {/* Thống kê */}
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: results.categoryInfo?.color || '#1976d2', fontWeight: 600 }}
                  >
                    📊 Thống kê
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">Câu đúng</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {results.correctCount || 0}/{results.totalQuestions || 0}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={
                          results.totalQuestions ? ((results.correctCount || 0) / results.totalQuestions) * 100 : 0
                        }
                        sx={{
                          height: { xs: 8, md: 10 },
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' },
                        }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">Câu sai</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                          {(results.totalQuestions || 0) - (results.correctCount || 0)}/{results.totalQuestions || 0}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={
                          results.totalQuestions
                            ? ((results.totalQuestions - (results.correctCount || 0)) / results.totalQuestions) * 100
                            : 0
                        }
                        sx={{
                          height: { xs: 8, md: 10 },
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' },
                        }}
                      />
                    </Box>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        Điểm số:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: scoreMessage.color, fontSize: { xs: '0.95rem', md: '1rem' } }}
                      >
                        {results.score || 0}%
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
                        Thời gian:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {formatTime(results.timeSpent || 0)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Hành động */}
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: results.categoryInfo?.color || '#1976d2', fontWeight: 600 }}
                  >
                    🎯 Tiếp theo
                  </Typography>

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Refresh />}
                      component={Link}
                      href={`/practice/part1/${category}/test?testId=${testId}`}
                      sx={{
                        backgroundColor: results.categoryInfo?.color || '#1976d2',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        py: { xs: 1, md: 1.25 },
                      }}
                    >
                      Làm lại bài test
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrendingUp />}
                      component={Link}
                      href="/practice/part1"
                      sx={{
                        borderColor: results.categoryInfo?.color || '#1976d2',
                        color: results.categoryInfo?.color || '#1976d2',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        py: { xs: 1, md: 1.25 },
                      }}
                    >
                      Chọn bài test khác
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Home />}
                      component={Link}
                      href="/"
                      sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.25 } }}
                    >
                      Về trang chủ
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải kết quả...
            </Typography>
          </Box>
        </DashboardLayout>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
