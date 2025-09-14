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
  IconButton,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  NavigateBefore,
  NavigateNext,
  CheckCircle,
  ArrowBack,
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
  transcript?: string;
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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Dễ':
      return '#4caf50';
    case 'TB':
      return '#ff9800';
    case 'Khó':
      return '#f44336';
    default:
      return '#757575';
  }
};

function ReviewContent() {
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

  // Review States
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Navigation handler
  const handleBackToResults = () => {
    router.push(`/practice/part1/${category}/results?testId=${testId}`);
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

  const handleNextQuestion = () => {
    // Stop current audio when changing questions
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
    if (testData && currentQuestion < testData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    // Stop current audio when changing questions
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handlePlayAudio = () => {
    const currentQuestionData = testData?.questions.find((q) => q.id === currentQuestion);
    if (!currentQuestionData?.audioUrl) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      // Create new audio element if it doesn't exist or if question changed
      if (!audioElement || audioElement.src !== currentQuestionData.audioUrl) {
        const newAudio = new Audio(currentQuestionData.audioUrl);
        newAudio.addEventListener('ended', () => setIsPlaying(false));
        newAudio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
        });
        setAudioElement(newAudio);
        newAudio.play().catch((e) => {
          console.error('Failed to play audio:', e);
          setIsPlaying(false);
        });
      } else {
        audioElement.play().catch((e) => {
          console.error('Failed to play audio:', e);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải câu hỏi...
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
              Lỗi tải dữ liệu
            </Typography>
            <Typography variant="body2">{error || 'Không thể tải dữ liệu câu hỏi. Vui lòng thử lại.'}</Typography>
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

  const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);

  return (
    <DashboardLayout>
      <Box>
        {/* Header */}
        <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToResults}
            sx={{ mr: 2, color: categoryData.color }}
          >
            Về kết quả
          </Button>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: categoryData.color, mb: 1 }}>
              {getCategoryEmoji(category)} Ôn tập - {testData.testInfo.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={testData.testInfo.difficulty}
                size="small"
                sx={{
                  backgroundColor: getDifficultyColor(testData.testInfo.difficulty) + '20',
                  color: getDifficultyColor(testData.testInfo.difficulty),
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={`${testData.testInfo.questions} câu`}
                size="small"
                sx={{
                  backgroundColor: categoryData.color + '20',
                  color: categoryData.color,
                  fontWeight: 'medium',
                }}
              />
            </Stack>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ color: categoryData.color }}>
              Câu {currentQuestion}/{testData.questions.length}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          {/* Phần hình ảnh và audio */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: categoryData.color }}>
                  📸 Hình ảnh & Audio
                </Typography>

                {/* Hình ảnh */}
                <Box
                  sx={{
                    mb: 3,
                    textAlign: 'center',
                    border: '2px dashed #ddd',
                    borderRadius: 2,
                    p: 2,
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={currentQuestionData?.imageUrl || '/images/placeholder/toeic-placeholder.svg'}
                    alt={`Question ${currentQuestion}`}
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 380,
                      objectFit: 'contain',
                    }}
                  />
                </Box>

                {/* Enhanced Audio Controls */}
                <Box sx={{ textAlign: 'center' }}>
                  <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
                    <IconButton
                      onClick={() => {
                        if (audioElement) {
                          audioElement.currentTime = Math.max(0, audioElement.currentTime - 5);
                        }
                      }}
                      sx={{
                        backgroundColor: categoryData.color + '20',
                        color: categoryData.color,
                        '&:hover': {
                          backgroundColor: categoryData.color + '30',
                        },
                      }}
                      disabled={!audioElement}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>-5s</Typography>
                    </IconButton>

                    <IconButton
                      onClick={handlePlayAudio}
                      sx={{
                        backgroundColor: categoryData.color,
                        color: 'white',
                        width: 80,
                        height: 80,
                        '&:hover': {
                          backgroundColor: categoryData.color + 'dd',
                        },
                      }}
                    >
                      {isPlaying ? <Pause sx={{ fontSize: 40 }} /> : <PlayArrow sx={{ fontSize: 40 }} />}
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        if (audioElement) {
                          audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 5);
                        }
                      }}
                      sx={{
                        backgroundColor: categoryData.color + '20',
                        color: categoryData.color,
                        '&:hover': {
                          backgroundColor: categoryData.color + '30',
                        },
                      }}
                      disabled={!audioElement}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>+5s</Typography>
                    </IconButton>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <VolumeUp sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: 16 }} />
                    {isPlaying ? 'Đang phát...' : 'Click để nghe audio'}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary">
                    💡 Sử dụng nút -5s/+5s để luyện nghe từng phần
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Phần đáp án và giải thích */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Các lựa chọn */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: categoryData.color }}>
                    📝 Các lựa chọn
                  </Typography>

                  <Stack spacing={2}>
                    {currentQuestionData?.options.map((option: string, index: number) => {
                      const optionLetter = String.fromCharCode(65 + index);
                      const isCorrect = optionLetter === currentQuestionData.correctAnswer;

                      return (
                        <Paper
                          key={option}
                          sx={{
                            p: 2,
                            border: isCorrect ? `2px solid #4caf50` : `1px solid #ddd`,
                            backgroundColor: isCorrect ? '#e8f5e9' : 'white',
                            borderRadius: 2,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: isCorrect ? '#4caf50' : '#e0e0e0',
                                color: isCorrect ? 'white' : 'black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                              }}
                            >
                              {optionLetter}
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                flex: 1,
                                fontWeight: isCorrect ? 'medium' : 'normal',
                              }}
                            >
                              {option}
                            </Typography>
                            {isCorrect && <CheckCircle sx={{ color: '#4caf50', fontSize: 24 }} />}
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>

              {/* Giải thích */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: categoryData.color }}>
                    💡 Giải thích đáp án
                  </Typography>

                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="body1">
                      <strong>Đáp án đúng: {currentQuestionData?.correctAnswer}</strong>
                    </Typography>
                  </Alert>

                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {currentQuestionData?.explanation}
                  </Typography>

                  {/* Vietnamese Transcript */}
                  {currentQuestionData?.transcript && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, color: categoryData.color, fontWeight: 'bold' }}>
                        📝 Transcript:
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: '#f8f9fa',
                          border: `1px solid ${categoryData.color}20`,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                          {currentQuestionData.transcript}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={`Chủ đề: ${currentQuestionData?.theme}`}
                      size="small"
                      sx={{
                        backgroundColor: categoryData.color + '20',
                        color: categoryData.color,
                      }}
                    />
                  </Stack>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: categoryData.color }}>
                      📚 Từ vựng quan trọng:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {currentQuestionData?.vocabulary.map((word: string, index: number) => (
                        <Chip
                          key={index}
                          label={word}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: categoryData.color,
                            color: categoryData.color,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<NavigateBefore />}
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 1}
                  sx={{ color: categoryData.color, borderColor: categoryData.color }}
                >
                  Câu trước
                </Button>

                {currentQuestion === testData.questions.length ? (
                  <Button
                    variant="contained"
                    component={Link}
                    href="/practice/part1"
                    sx={{ backgroundColor: categoryData.color }}
                  >
                    Hoàn thành
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<NavigateNext />}
                    onClick={handleNextQuestion}
                    sx={{ backgroundColor: categoryData.color }}
                  >
                    Câu tiếp
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải câu hỏi...
            </Typography>
          </Box>
        </DashboardLayout>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
