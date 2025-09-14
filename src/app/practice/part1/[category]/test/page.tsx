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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  NavigateBefore,
  NavigateNext,
  Flag,
  CheckCircle,
  Cancel,
  Timer,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
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

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Dễ':
      return '#4caf50';
    case 'Trung bình':
      return '#ff9800';
    case 'Khó':
      return '#f44336';
    default:
      return '#757575';
  }
};

function TestContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const category = params.category as string;
  const testId = parseInt(searchParams.get('testId') || '1');

  // API States
  const [testData, setTestData] = useState<TestData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test States
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Use ref to track if we should auto play (to avoid loops)
  const shouldAutoPlayRef = useRef(false);

  // Cleanup audio when component unmounts or page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
      }
      
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audioElement]);

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

        // Get category info (from previous API or hardcoded mapping)
        const categoryInfo = getCategoryInfo(category);
        setCategoryData(categoryInfo);

        // Set timer
        const timeInMinutes = parseInt(apiData.data.testInfo.duration.split(' ')[0]);
        setTimeLeft(timeInMinutes * 60);
        
        // Mark that we should auto play the first question
        shouldAutoPlayRef.current = true;
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

  const handlePlayAudio = useCallback(() => {
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
        newAudio.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => {
          console.error('Failed to play audio:', e);
          setIsPlaying(false);
        });
      } else {
        audioElement.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => {
          console.error('Failed to play audio:', e);
          setIsPlaying(false);
        });
      }
    }
  }, [testData, currentQuestion, isPlaying, audioElement]);

  // Auto play audio when test data is loaded or question changes
  useEffect(() => {
    if (testData && shouldAutoPlayRef.current) {
      const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);
      if (currentQuestionData?.audioUrl) {
        // Auto play audio after a short delay to ensure UI is ready
        const autoPlayTimer = setTimeout(() => {
          // Stop current audio if playing
          if (audioElement) {
            audioElement.pause();
            setIsPlaying(false);
          }

          // Create new audio element for auto play
          const newAudio = new Audio(currentQuestionData.audioUrl);
          newAudio.addEventListener('ended', () => setIsPlaying(false));
          newAudio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            setIsPlaying(false);
          });
          setAudioElement(newAudio);
          newAudio.play().then(() => {
            setIsPlaying(true);
          }).catch((e) => {
            console.error('Failed to play audio:', e);
            setIsPlaying(false);
          });
          
          // Reset the flag after auto playing
          shouldAutoPlayRef.current = false;
        }, 800);

        return () => clearTimeout(autoPlayTimer);
      }
    }
  }, [testData, currentQuestion, audioElement]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && testData) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testData) {
      handleFinishTest();
    }
  }, [timeLeft, testData]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    // Stop current audio when changing questions
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
    if (testData && currentQuestion < testData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      // Mark that we should auto play the next question
      shouldAutoPlayRef.current = true;
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
      // Mark that we should auto play the previous question
      shouldAutoPlayRef.current = true;
    }
  };

  const handleFinishTest = () => {
    setShowFinishDialog(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải bài test...
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
            <Typography variant="body2">{error || 'Không thể tải dữ liệu bài test. Vui lòng thử lại.'}</Typography>
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
  const progress = ((currentQuestion - 1) / testData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <DashboardLayout>
      <Box>
        {/* Header với thông tin test */}
        <Box sx={{ mb: 4, p: 3, backgroundColor: categoryData.bgColor, borderRadius: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: categoryData.color, mb: 1 }}>
                {getCategoryEmoji(category)} {testData.testInfo.title}
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
              <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', color: timeLeft < 300 ? '#f44336' : categoryData.color }}
              >
                <Timer sx={{ mr: 1, fontSize: 'inherit' }} />
                {formatTime(timeLeft)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Thời gian còn lại
              </Typography>
            </Box>
          </Stack>

          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Câu {currentQuestion}/{testData.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã trả lời: {answeredCount}/{testData.questions.length}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: categoryData.color,
                },
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Phần hình ảnh và audio */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: categoryData.color }}>
                  Câu {currentQuestion}
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

                {/* Audio Controls */}
                <Box sx={{ textAlign: 'center' }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <VolumeUp sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: 16 }} />
                    Click để nghe audio
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Phần trả lời */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: categoryData.color }}>
                  Nghe audio và chọn đáp án phù hợp với hình ảnh
                </Typography>

                <Stack spacing={2} sx={{ mb: 4 }}>
                  {/* Part 1 chỉ hiển thị các nút A, B, C, D không có nội dung đáp án */}
                  {['A', 'B', 'C', 'D'].map((optionLetter) => {
                    const isSelected = answers[currentQuestion] === optionLetter;

                    return (
                      <Button
                        key={optionLetter}
                        variant={isSelected ? 'contained' : 'outlined'}
                        fullWidth
                        size="large"
                        onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
                        sx={{
                          justifyContent: 'center',
                          textAlign: 'center',
                          py: 3,
                          px: 3,
                          backgroundColor: isSelected ? categoryData.color : 'transparent',
                          borderColor: categoryData.color,
                          color: isSelected ? 'white' : categoryData.color,
                          '&:hover': {
                            backgroundColor: isSelected ? categoryData.color + 'dd' : categoryData.color + '10',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'white' : 'transparent',
                            color: isSelected ? categoryData.color : 'inherit',
                            border: !isSelected ? `3px solid ${categoryData.color}` : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            flexShrink: 0,
                          }}
                        >
                          {optionLetter}
                        </Box>
                      </Button>
                    );
                  })}
                </Stack>

                {/* Navigation buttons */}
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
                      startIcon={<Flag />}
                      onClick={handleFinishTest}
                      sx={{ backgroundColor: '#f44336' }}
                    >
                      Nộp bài
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog kết thúc test */}
        <Dialog open={showFinishDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
            <Typography component="div" variant="h5" sx={{ fontWeight: 600 }}>
              Hoàn thành bài test!
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bạn đã hoàn thành <strong>{testData.testInfo.title}</strong>
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <Chip label={`${answeredCount}/${testData.questions.length} câu`} color="primary" />
              <Chip
                label={formatTime(Math.max(0, parseInt(testData.testInfo.duration.split(' ')[0]) * 60 - timeLeft))}
                color="secondary"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Kết quả sẽ được hiển thị sau khi xem lại đáp án
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button variant="outlined" startIcon={<Cancel />} component={Link} href="/practice/part1">
              Về trang chủ
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              onClick={() => {
                // Lưu answers vào sessionStorage
                sessionStorage.setItem(`test_answers_${category}_${testId}`, JSON.stringify(answers));
                sessionStorage.setItem(
                  `test_time_spent_${category}_${testId}`,
                  Math.max(0, parseInt(testData.testInfo.duration.split(' ')[0]) * 60 - timeLeft).toString(),
                );

                // Chuyển hướng đến results page
                window.location.href = `/practice/part1/${category}/results?testId=${testId}`;
              }}
              sx={{ backgroundColor: categoryData.color }}
            >
              Xem kết quả
            </Button>
          </DialogActions>
        </Dialog>
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
