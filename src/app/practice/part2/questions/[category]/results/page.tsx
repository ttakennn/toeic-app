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
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Timer,
  Star,
  TrendingUp,
  Refresh,
  ArrowBack,
  QuestionAnswer,
  Assignment,
} from '@mui/icons-material';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

interface QuestionResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  question: {
    id: number;
    audioUrl: string;
    question: {
      en: string;
      vi: string;
    };
    answerA: {
      en: string;
      vi: string;
    };
    answerB: {
      en: string;
      vi: string;
    };
    answerC: {
      en: string;
      vi: string;
    };
    correctAnswer: string;
    explanation: string;
    theme: string;
    difficulty: string;
    vocabulary: string[];
  };
}

interface TestResults {
  testInfo: {
    id: number;
    title: string;
    difficulty: string;
    questions: number;
    duration: string;
    category: string;
    description: string;
  };
  categoryInfo: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
  };
  questionResults: QuestionResult[];
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
  submittedAt: string;
}

const getCategoryEmoji = (categoryId: string) => {
  switch (categoryId) {
    case 'what':
      return '❓';
    case 'who':
      return '👤';
    case 'where':
      return '📍';
    case 'when':
      return '⏰';
    case 'how':
      return '🔧';
    case 'why':
      return '🤔';
    case 'yesno':
      return '✅';
    case 'tag':
      return '🏷️';
    case 'choice':
      return '🔀';
    case 'request':
      return '🙏';
    case 'statement':
      return '💬';
    case 'mixed':
      return '🤝';
    default:
      return '📝';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Dễ':
      return '#4caf50';
    case 'Trung bình':
      return '#ff9800';
    case 'Khó':
      return '#f44336';
    case 'Thực tế':
      return '#2196f3';
    default:
      return '#757575';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'success.main';
  if (score >= 60) return 'warning.main';
  return 'error.main';
};

const getScoreEmoji = (score: number) => {
  if (score >= 90) return '🏆';
  if (score >= 80) return '🥇';
  if (score >= 70) return '🥈';
  if (score >= 60) return '🥉';
  return '📈';
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function Part2ResultsPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params?.category as string;
  const testId = searchParams?.get('testId');

  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!category || !testId) {
        setError('Thiếu thông tin category hoặc testId');
        setLoading(false);
        return;
      }

      const resultsKey = `part2_test_results_${category}_${testId}`;
      const storedResults = localStorage.getItem(resultsKey);

      if (!storedResults) {
        setError('Không tìm thấy kết quả bài test. Vui lòng làm lại bài test.');
        setLoading(false);
        return;
      }

      const parsedResults: TestResults = JSON.parse(storedResults);
      setResults(parsedResults);
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Có lỗi xảy ra khi tải kết quả');
      setLoading(false);
    }
  }, [category, testId]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6">Đang tải kết quả...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !results) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Lỗi tải kết quả
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" component={Link} href={`/practice/part2`}>
            Quay về trang chủ Part 2
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header */}
        <Card
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            background: `linear-gradient(135deg, ${results.categoryInfo.color}20 0%, ${results.categoryInfo.color}10 100%)`,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack spacing={3}>
              {/* Score Summary */}
              <Stack
                direction={{ xs: 'row', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack>
                  <Typography
                    variant="h4"
                    sx={{
                      color: results.categoryInfo.color,
                      fontWeight: 'bold',
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                    }}
                  >
                    {getScoreEmoji(results.score)} Kết quả bài test
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {getCategoryEmoji(category)} {results.testInfo.title}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: { xs: 60, sm: 80 },
                      height: { xs: 60, sm: 80 },
                      backgroundColor: getScoreColor(results.score),
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      fontWeight: 'bold',
                      alignSelf: { xs: 'center', sm: 'auto' },
                    }}
                  >
                    {results.score}%
                  </Avatar>
                </Stack>
              </Stack>
              {/* Result Summary */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <CheckCircle sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {results.correctCount}
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
                        {results.totalQuestions - results.correctCount}
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
                        {formatTime(results.timeSpent)}
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
                      <Star sx={{ fontSize: 30, color: getScoreColor(results.score), mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: getScoreColor(results.score) }}>
                        {results.score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Điểm số
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* Performance Analysis */}
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Độ chính xác</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {results.score}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={results.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getScoreColor(results.score),
                      },
                    }}
                  />
                </Box>
                {results.score >= 80 ? (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      🎉 Xuất sắc! Bạn đã nắm vững dạng câu hỏi này.
                    </Typography>
                  </Alert>
                ) : results.score >= 60 ? (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      👍 Khá tốt! Hãy luyện tập thêm để cải thiện.
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      💪 Cần cải thiện! Hãy xem lại và luyện tập nhiều hơn.
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Question Details - Takes more space */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuestionAnswer /> Chi tiết từng câu hỏi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                  💡 Click vào bất kỳ câu hỏi nào để xem chi tiết và review
                </Typography>

                <Stack spacing={2}>
                  {results.questionResults.map((result) => (
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
                      onClick={() => {
                        window.location.href = `/practice/part2/questions/${category}/review?testId=${testId}&questionIndex=${results.questionResults.indexOf(
                          result,
                        )}`;
                      }}
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
                                sx={{ backgroundColor: results.categoryInfo.color, color: 'white' }}
                              />
                              <Chip label={result.question.theme} variant="outlined" size="small" />
                              <Chip
                                label={result.question.difficulty}
                                size="small"
                                sx={{
                                  backgroundColor: getDifficultyColor(result.question.difficulty) + '20',
                                  color: getDifficultyColor(result.question.difficulty),
                                }}
                              />
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
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons - Takes less space */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Action Buttons */}
            <Card sx={{ height: 'fit-content', mb: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment /> Hành động
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    component={Link}
                    href={`/practice/part2`}
                    size="large"
                    fullWidth
                  >
                    Quay về Part 2
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<QuestionAnswer />}
                    component={Link}
                    href={`/practice/part2/questions/${category}/review?testId=${testId}`}
                    size="large"
                    fullWidth
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    component={Link}
                    href={`/practice/part2/questions/${category}/test?testId=${testId}`}
                    size="large"
                    fullWidth
                    sx={{
                      backgroundColor: results.categoryInfo.color,
                      '&:hover': {
                        backgroundColor: results.categoryInfo.color + 'dd',
                      },
                    }}
                  >
                    Làm lại
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default function Part2ResultsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Typography variant="h6">Đang tải kết quả...</Typography>
          </Box>
        </DashboardLayout>
      }
    >
      <Part2ResultsPageContent />
    </Suspense>
  );
}
