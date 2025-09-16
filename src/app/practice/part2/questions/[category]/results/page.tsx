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
  Visibility,
  Translate,
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
  const [showTranslationById, setShowTranslationById] = useState<Record<number, boolean>>({});

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
          <Button
            variant="contained"
            component={Link}
            href={`/practice/part2`}
          >
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
        <Card sx={{ mb: { xs: 2, sm: 3, md: 4 }, background: `linear-gradient(135deg, ${results.categoryInfo.color}20 0%, ${results.categoryInfo.color}10 100%)` }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Stack>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      color: results.categoryInfo.color, 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    {getScoreEmoji(results.score)} Kết quả bài test
                  </Typography>
                  <Typography 
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
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
                    alignSelf: { xs: 'center', sm: 'auto' }
                  }}
                >
                  {results.score}%
                </Avatar>
                </Stack>
              </Stack>

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
            </Stack>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp /> Phân tích kết quả
                </Typography>
                
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
                          backgroundColor: getScoreColor(results.score)
                        }
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
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment /> Thống kê theo chủ đề
                </Typography>

                <Stack spacing={2}>
                  {(() => {
                    const themeStats = results.questionResults.reduce((acc, result) => {
                      const theme = result.question.theme;
                      if (!acc[theme]) {
                        acc[theme] = { correct: 0, total: 0 };
                      }
                      acc[theme].total++;
                      if (result.isCorrect) {
                        acc[theme].correct++;
                      }
                      return acc;
                    }, {} as Record<string, { correct: number; total: number }>);

                    return Object.entries(themeStats).map(([theme, stats]) => (
                      <Box key={theme}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontSize: '13px' }}>
                            {theme}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 'medium' }}>
                            {stats.correct}/{stats.total}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(stats.correct / stats.total) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f0f0f0'
                          }}
                        />
                      </Box>
                    ));
                  })()}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Question Details */}
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
                      backgroundColor: result.isCorrect ? '#f0fff0' : '#fff0f0'
                    }
                  }}
                  onClick={() => {
                    window.location.href = `/practice/part2/questions/${category}/review?testId=${testId}&questionIndex=${results.questionResults.indexOf(result)}`;
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
                          <Chip
                            label={result.question.theme}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={result.question.difficulty}
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(result.question.difficulty) + '20',
                              color: getDifficultyColor(result.question.difficulty)
                            }}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {result.isCorrect ? (
                            <CheckCircle sx={{ color: 'success.main' }} />
                          ) : (
                            <Cancel sx={{ color: 'error.main' }} />
                          )}
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<Translate />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTranslationById((prev) => ({
                                ...prev,
                                [result.questionId]: !prev[result.questionId]
                              }));
                            }}
                            sx={{ minWidth: 'auto', px: 1 }}
                          >
                            {showTranslationById[result.questionId] ? 'Ẩn dịch' : 'Dịch'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            component={Link}
                            href={`/practice/part2/questions/${category}/review?testId=${testId}&questionIndex=${results.questionResults.indexOf(result)}`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              minWidth: 'auto',
                              fontSize: '0.75rem',
                              py: 0.5,
                              px: 1
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </Stack>
                      </Stack>

                      {/* Question Content */}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                          📝 {result.question.question.en}
                        </Typography>
                        {showTranslationById[result.questionId] && result.question.question.vi && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                            🇻🇳 {result.question.question.vi}
                          </Typography>
                        )}

                        <Grid container spacing={2}>
                          {[
                            { option: 'A', text: result.question.answerA.en, textVN: result.question.answerA.vi },
                            { option: 'B', text: result.question.answerB.en, textVN: result.question.answerB.vi },
                            { option: 'C', text: result.question.answerC.en, textVN: result.question.answerC.vi }
                          ].map(({ option, text, textVN }) => (
                            <Grid size={{ xs: 12, sm: 4 }} key={option}>
                              <Card
                                variant="outlined"
                                sx={{
                                  backgroundColor: 
                                    option === result.correctAnswer ? '#e8f5e8' :
                                    option === result.userAnswer && !result.isCorrect ? '#ffebee' :
                                    'transparent',
                                  border:
                                    option === result.correctAnswer ? '2px solid #4caf50' :
                                    option === result.userAnswer && !result.isCorrect ? '2px solid #f44336' :
                                    '1px solid #e0e0e0'
                                }}
                              >
                                <CardContent sx={{ py: 1.5 }}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h6" sx={{ 
                                      color: 
                                        option === result.correctAnswer ? 'success.main' :
                                        option === result.userAnswer && !result.isCorrect ? 'error.main' :
                                        'text.primary'
                                    }}>
                                      {option}
                                    </Typography>
                                    {option === result.correctAnswer && (
                                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                                    )}
                                    {option === result.userAnswer && !result.isCorrect && (
                                      <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
                                    )}
                                  </Stack>
                                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {text}
                                  </Typography>
                                  {showTranslationById[result.questionId] && textVN && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.3 }}>
                                      🇻🇳 {textVN}
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>

                        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                            💡 Giải thích:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {result.question.explanation}
                          </Typography>
                        </Box>

                        {/* User's Answer */}
                        <Stack 
                          direction={{ xs: 'column', sm: 'row' }} 
                          spacing={2} 
                          sx={{ mt: 2 }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                              <strong>Câu trả lời của bạn:</strong>
                            </Typography>
                            <Chip
                              label={result.userAnswer}
                              size="small"
                              sx={{
                                backgroundColor: result.isCorrect ? 'success.main' : 'error.main',
                                color: 'white'
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
                                color: 'white'
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

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={Link}
            href={`/practice/part2`}
            size="large"
          >
            Quay về Part 2
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            component={Link}
            href={`/practice/part2/questions/${category}/review?testId=${testId}`}
            size="large"
          >
            Xem chi tiết
          </Button>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            component={Link}
            href={`/practice/part2/questions/${category}/test?testId=${testId}`}
            size="large"
            sx={{
              backgroundColor: results.categoryInfo.color,
              '&:hover': {
                backgroundColor: results.categoryInfo.color + 'dd'
              }
            }}
          >
            Làm lại
          </Button>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}

export default function Part2ResultsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Typography variant="h6">Đang tải kết quả...</Typography>
        </Box>
      </DashboardLayout>
    }>
      <Part2ResultsPageContent />
    </Suspense>
  );
}
