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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Home,
  Refresh,
  TrendingUp,
  Error as ErrorIcon,
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

  // API States
  const [testData, setTestData] = useState<TestData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Results States
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

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
        title: 'Cụm từ tả người + vật/cảnh',
        description: 'Tương tác giữa người và môi trường',
        icon: '/images/categories/mixed-icon.svg',
        color: '#ff9800',
        bgColor: '#fff3e0',
        totalTests: 6,
      },
    };
    return categoryMap[categoryId] || categoryMap.basic;
  };

  // Load test data and results
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

        // Fetch test data
        const response = await fetch(`/api/part1/questions/${category}/${testId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData: TestApiResponse = await response.json();
        if (!apiData.success) {
          throw new Error('Failed to load test data');
        }

        setTestData(apiData.data);
        setCategoryData(getCategoryInfo(category));

        // Load user answers from sessionStorage
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
          setScore(Math.round((correct / apiData.data.questions.length) * 100));
        }

        if (savedTime) {
          setTimeSpent(parseInt(savedTime));
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

  if (error || !testData || !categoryData) {
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

  const correctCount = Object.keys(userAnswers).reduce((count, questionId) => {
    const question = testData.questions.find((q) => q.id === parseInt(questionId));
    return count + (question && userAnswers[parseInt(questionId)] === question.correctAnswer ? 1 : 0);
  }, 0);

  const scoreMessage = getScoreMessage(score);

  return (
    <DashboardLayout>
      <Box>
        {/* Header với kết quả tổng quan */}
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${categoryData.color} 0%, ${categoryData.color}dd 100%)`,
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {getCategoryEmoji(category)} Kết quả bài test
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {testData.testInfo.title}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                  {score}%
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {correctCount}/{testData.questions.length} câu đúng
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
                {scoreMessage.message}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                    borderRadius: 6,
                  },
                }}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Chip
                label={testData.testInfo.difficulty}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={`${testData.questions.length} câu hỏi`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={`Thời gian: ${formatTime(timeSpent)}`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Chi tiết từng câu hỏi */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: categoryData.color, fontWeight: 600 }}>
                  📝 Chi tiết từng câu hỏi
                </Typography>

                <List>
                  {testData.questions.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    // Convert letter answer back to full option text for display
                    const getUserAnswerText = () => {
                      if (!userAnswer) return 'Không trả lời';
                      const optionIndex = userAnswer.charCodeAt(0) - 65; // Convert A,B,C,D to 0,1,2,3
                      return question.options[optionIndex] || userAnswer;
                    };
                    
                    const getCorrectAnswerText = () => {
                      const optionIndex = question.correctAnswer.charCodeAt(0) - 65;
                      return question.options[optionIndex] || question.correctAnswer;
                    };

                    return (
                      <Box key={question.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemButton 
                            sx={{ borderRadius: 2 }}
                            onClick={() => handleQuestionClick(question.id)}
                          >
                            <ListItemIcon>
                              {isCorrect ? (
                                <CheckCircle sx={{ color: '#4caf50', fontSize: 28 }} />
                              ) : (
                                <Cancel sx={{ color: '#f44336', fontSize: 28 }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    Câu {question.id}
                                  </Typography>
                                  <Chip
                                    label={question.theme}
                                    size="small"
                                    sx={{
                                      backgroundColor: categoryData.color + '20',
                                      color: categoryData.color,
                                      fontSize: '11px',
                                    }}
                                  />
                                </Stack>
                              }
                              secondary={
                                <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                  <strong>Đáp án của bạn:</strong> {getUserAnswerText()}
                                  {!isCorrect && (
                                    <span style={{ marginLeft: 8 }}>
                                      | <strong>Đáp án đúng:</strong> {getCorrectAnswerText()}
                                    </span>
                                  )}
                                </Box>
                              }
                            />
                          </ListItemButton>
                          {!isCorrect && (
                            <Box sx={{ px: 2, pb: 2 }}>
                              <Alert severity="info" sx={{ py: 0 }}>
                                <Box component="span" sx={{ fontSize: '0.75rem' }}>
                                  💡 <strong>Giải thích:</strong> {question.explanation}
                                </Box>
                              </Alert>
                            </Box>
                          )}
                        </ListItem>
                        {index < testData.questions.length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Thống kê và hành động */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Thống kê */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: categoryData.color, fontWeight: 600 }}>
                    📊 Thống kê
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">Câu đúng</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                          {correctCount}/{testData.questions.length}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(correctCount / testData.questions.length) * 100}
                        sx={{
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' },
                        }}
                      />
                    </Box>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography variant="body2">Câu sai</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                          {testData.questions.length - correctCount}/{testData.questions.length}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={((testData.questions.length - correctCount) / testData.questions.length) * 100}
                        sx={{
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' },
                        }}
                      />
                    </Box>

                    <Divider />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Điểm số:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: scoreMessage.color }}>
                        {score}%
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Thời gian:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatTime(timeSpent)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Hành động */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: categoryData.color, fontWeight: 600 }}>
                    🎯 Tiếp theo
                  </Typography>

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Refresh />}
                      component={Link}
                      href={`/practice/part1/${category}/test?testId=${testId}`}
                      sx={{ backgroundColor: categoryData.color }}
                    >
                      Làm lại bài test
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<TrendingUp />}
                      component={Link}
                      href="/practice/part1"
                      sx={{ borderColor: categoryData.color, color: categoryData.color }}
                    >
                      Chọn bài test khác
                    </Button>

                    <Button variant="outlined" fullWidth startIcon={<Home />} component={Link} href="/">
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
