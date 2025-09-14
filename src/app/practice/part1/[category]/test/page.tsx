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
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Use ref to track if we should auto play (to avoid loops) and user interaction
  const shouldAutoPlayRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const audioLoadingRef = useRef(false);

  // Cleanup audio when component unmounts or page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioElement && !audioLoadingRef.current) {
        try {
          audioElement.pause();
          audioElement.currentTime = 0;
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
      audioLoadingRef.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden && audioElement && !audioLoadingRef.current) {
        try {
          audioElement.pause();
          setIsPlaying(false);
        } catch (error) {
          console.warn('Error pausing on visibility change:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup audio
      if (audioElement && !audioLoadingRef.current) {
        try {
          audioElement.pause();
          audioElement.currentTime = 0;
          setIsPlaying(false);
        } catch (error) {
          console.warn('Error during final cleanup:', error);
        }
      }
      audioLoadingRef.current = false;

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

        // Set timer but don't start countdown yet
        const timeInMinutes = parseInt(apiData.data.testInfo.duration.split(' ')[0]);
        setTimeLeft(timeInMinutes * 60);

        // Show start dialog
        setShowStartDialog(true);
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

  const handlePlayAudio = useCallback(async () => {
    // Mark that user has interacted
    hasUserInteractedRef.current = true;
    
    const currentQuestionData = testData?.questions.find((q) => q.id === currentQuestion);
    if (!currentQuestionData?.audioUrl || audioLoadingRef.current) return;

    try {
      if (isPlaying && audioElement) {
        audioElement.pause();
        setIsPlaying(false);
        return;
      }

      audioLoadingRef.current = true;

      // Create new audio element if it doesn't exist or if question changed
      if (!audioElement || audioElement.src !== currentQuestionData.audioUrl) {
        // Clean up old audio first
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }

        const newAudio = new Audio(currentQuestionData.audioUrl);
        
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
          audioLoadingRef.current = false;
        });
        
        newAudio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
          audioLoadingRef.current = false;
        });

        newAudio.addEventListener('loadstart', () => {
          audioLoadingRef.current = true;
        });

        newAudio.addEventListener('canplay', () => {
          audioLoadingRef.current = false;
        });

        setAudioElement(newAudio);

        try {
          await newAudio.play();
          setIsPlaying(true);
        } catch (error: unknown) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Failed to play audio:', error);
          }
          setIsPlaying(false);
        }
      } else {
        try {
          await audioElement.play();
          setIsPlaying(true);
        } catch (error: unknown) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Failed to play audio:', error);
          }
          setIsPlaying(false);
        }
      }
    } finally {
      audioLoadingRef.current = false;
    }
  }, [testData, currentQuestion, isPlaying, audioElement]);

  // Auto play audio when test data is loaded or question changes (only after user interaction)
  useEffect(() => {
    if (testData && shouldAutoPlayRef.current && hasUserInteractedRef.current && !audioLoadingRef.current) {
      const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);
      if (currentQuestionData?.audioUrl) {
        // Auto play audio after a short delay to ensure UI is ready
        const autoPlayTimer = setTimeout(async () => {
          try {
            audioLoadingRef.current = true;

            // Stop current audio if playing
            if (audioElement) {
              audioElement.pause();
              audioElement.currentTime = 0;
              setIsPlaying(false);
            }

            // Create new audio element for auto play
            const newAudio = new Audio(currentQuestionData.audioUrl);
            
            newAudio.addEventListener('ended', () => {
              setIsPlaying(false);
              audioLoadingRef.current = false;
            });
            
            newAudio.addEventListener('error', (e) => {
              console.error('Audio playback error:', e);
              setIsPlaying(false);
              audioLoadingRef.current = false;
            });

            newAudio.addEventListener('loadstart', () => {
              audioLoadingRef.current = true;
            });

            newAudio.addEventListener('canplay', () => {
              audioLoadingRef.current = false;
            });

            setAudioElement(newAudio);
            
            try {
              await newAudio.play();
              setIsPlaying(true);
            } catch (error: unknown) {
              if ((error as Error).name !== 'AbortError') {
                console.error('Failed to auto-play audio:', error);
              }
              setIsPlaying(false);
            }
          } finally {
            audioLoadingRef.current = false;
            // Reset the flag after auto playing
            shouldAutoPlayRef.current = false;
          }
        }, 800);

        return () => clearTimeout(autoPlayTimer);
      }
    }
  }, [testData, currentQuestion, audioElement, testStarted]);

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
    // Mark that user has interacted
    hasUserInteractedRef.current = true;
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    // Mark that user has interacted
    hasUserInteractedRef.current = true;
    
    // Safely stop current audio when changing questions
    if (audioElement && !audioLoadingRef.current) {
      try {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
      } catch (error) {
        console.warn('Error pausing audio:', error);
      }
    }
    
    if (testData && currentQuestion < testData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      // Mark that we should auto play the next question
      shouldAutoPlayRef.current = true;
    }
  };

  const handlePrevQuestion = () => {
    // Mark that user has interacted
    hasUserInteractedRef.current = true;
    
    // Safely stop current audio when changing questions
    if (audioElement && !audioLoadingRef.current) {
      try {
        audioElement.pause();
        audioElement.currentTime = 0;
        setIsPlaying(false);
      } catch (error) {
        console.warn('Error pausing audio:', error);
      }
    }
    
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      // Mark that we should auto play the previous question
      shouldAutoPlayRef.current = true;
    }
  };

  const handleStartTest = async () => {
    // Mark that user has interacted
    hasUserInteractedRef.current = true;
    
    // Start the test
    setTestStarted(true);
    setShowStartDialog(false);
    
    // Play first question audio immediately
    const currentQuestionData = testData?.questions.find((q) => q.id === 1);
    if (currentQuestionData?.audioUrl && !audioLoadingRef.current) {
      try {
        audioLoadingRef.current = true;

        // Stop any existing audio
        if (audioElement) {
          try {
            audioElement.pause();
            audioElement.currentTime = 0;
            setIsPlaying(false);
          } catch (error) {
            console.warn('Error cleaning up existing audio:', error);
          }
        }

        // Create and play audio for first question
        const newAudio = new Audio(currentQuestionData.audioUrl);
        
        newAudio.addEventListener('ended', () => {
          setIsPlaying(false);
          audioLoadingRef.current = false;
        });
        
        newAudio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
          audioLoadingRef.current = false;
        });

        newAudio.addEventListener('loadstart', () => {
          audioLoadingRef.current = true;
        });

        newAudio.addEventListener('canplay', () => {
          audioLoadingRef.current = false;
        });

        setAudioElement(newAudio);
        
        try {
          await newAudio.play();
          setIsPlaying(true);
          console.log('Auto-play started successfully');
        } catch (error: unknown) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Failed to play audio on start:', error);
          }
          setIsPlaying(false);
        }
      } finally {
        audioLoadingRef.current = false;
      }
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
        <Box sx={{ mb: { xs: 3, md: 4 }, p: { xs: 2, md: 3 }, backgroundColor: categoryData.bgColor, borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
            spacing={{ xs: 2, sm: 0 }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: categoryData.color,
                  mb: 1,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                }}
              >
                {getCategoryEmoji(category)} {testData.testInfo.title}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={testData.testInfo.difficulty}
                  size="small"
                  sx={{
                    backgroundColor: getDifficultyColor(testData.testInfo.difficulty) + '20',
                    color: getDifficultyColor(testData.testInfo.difficulty),
                    fontWeight: 'medium',
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                  }}
                />
                <Chip
                  label={`${testData.testInfo.questions} câu`}
                  size="small"
                  sx={{
                    backgroundColor: categoryData.color + '20',
                    color: categoryData.color,
                    fontWeight: 'medium',
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: timeLeft < 300 ? '#f44336' : categoryData.color,
                  fontSize: { xs: '1.8rem', md: '2.125rem' },
                }}
              >
                <Timer sx={{ mr: 1, fontSize: 'inherit' }} />
                {formatTime(timeLeft)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                Thời gian còn lại
              </Typography>
            </Box>
          </Stack>

          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              sx={{ mb: 1 }}
              spacing={{ xs: 0.5, sm: 0 }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                Câu {currentQuestion}/{testData.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                Đã trả lời: {answeredCount}/{testData.questions.length}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: { xs: 6, md: 8 },
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: categoryData.color,
                },
              }}
            />
          </Box>
        </Box>

        {/* Layout responsive - mobile: single column, desktop: two columns */}
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Mobile: Single column layout */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: categoryData.color,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  Câu {currentQuestion}
                </Typography>

                {/* Responsive layout: mobile stacked, desktop side-by-side */}
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {/* Image section */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        border: '2px dashed #ddd',
                        borderRadius: 2,
                        p: { xs: 1, md: 2 },
                        minHeight: { xs: 300, md: 350 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: { xs: 2, md: 0 },
                      }}
                    >
                      <Box
                        component="img"
                        src={currentQuestionData?.imageUrl || '/images/placeholder/toeic-placeholder.svg'}
                        alt={`Question ${currentQuestion}`}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: { xs: 280, md: 330 },
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Controls and answers section */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    {/* Audio Controls */}
                    <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
                      <IconButton
                        onClick={handlePlayAudio}
                        sx={{
                          backgroundColor: categoryData.color,
                          color: 'white',
                          width: { xs: 50, md: 70 },
                          height: { xs: 50, md: 70 },
                          mb: 1,
                          '&:hover': {
                            backgroundColor: categoryData.color + 'dd',
                          },
                        }}
                      >
                        {isPlaying ? (
                          <Pause sx={{ fontSize: { xs: 24, md: 35 } }} />
                        ) : (
                          <PlayArrow sx={{ fontSize: { xs: 24, md: 35 } }} />
                        )}
                      </IconButton>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                      >
                        <VolumeUp sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: 14 }} />
                        {!hasUserInteractedRef.current ? 'Click để nghe audio' : 'Nghe audio và chọn đáp án'}
                      </Typography>
                    </Box>

                    {/* Answer options */}
                    <Box sx={{ mb: { xs: 2, md: 4 } }}>
                      {/* Mobile: 4 buttons in one row, Desktop: Stack layout */}
                      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Grid container spacing={1}>
                          {['A', 'B', 'C', 'D'].map((optionLetter) => {
                            const isSelected = answers[currentQuestion] === optionLetter;
                            return (
                              <Grid key={optionLetter} size={3}>
                                <Button
                                  variant={isSelected ? 'contained' : 'outlined'}
                                  fullWidth
                                  onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
                                  sx={{
                                    aspectRatio: '1',
                                    minHeight: 60,
                                    backgroundColor: isSelected ? categoryData.color : 'transparent',
                                    borderColor: categoryData.color,
                                    color: isSelected ? 'white' : categoryData.color,
                                    '&:hover': {
                                      backgroundColor: isSelected ? categoryData.color + 'dd' : categoryData.color + '10',
                                    },
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 'bold',
                                      fontSize: '1.2rem',
                                    }}
                                  >
                                    {optionLetter}
                                  </Typography>
                                </Button>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Desktop: Stack layout */}
                      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Stack spacing={2}>
                          {['A', 'B', 'C', 'D'].map((optionLetter) => {
                            const isSelected = answers[currentQuestion] === optionLetter;
                            return (
                              <Button
                                key={optionLetter}
                                variant={isSelected ? 'contained' : 'outlined'}
                                fullWidth
                                onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
                                sx={{
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                  py: 2,
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
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: isSelected ? 'white' : 'transparent',
                                    color: isSelected ? categoryData.color : 'inherit',
                                    border: !isSelected ? `2px solid ${categoryData.color}` : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.3rem',
                                    flexShrink: 0,
                                  }}
                                >
                                  {optionLetter}
                                </Box>
                              </Button>
                            );
                          })}
                        </Stack>
                      </Box>
                    </Box>

                    {/* Navigation buttons */}
                    <Stack direction="row" spacing={{ xs: 1, md: 2 }} justifyContent="space-between">
                      <Button
                        variant="outlined"
                        startIcon={<NavigateBefore />}
                        onClick={handlePrevQuestion}
                        disabled={currentQuestion === 1}
                        size="medium"
                        sx={{
                          color: categoryData.color,
                          borderColor: categoryData.color,
                          fontSize: { xs: '0.8rem', md: '0.875rem' },
                          px: { xs: 1, md: 2 },
                        }}
                      >
                        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Câu trước</Box>
                        <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Trước</Box>
                      </Button>

                      {currentQuestion === testData.questions.length ? (
                        <Button
                          variant="contained"
                          startIcon={<Flag />}
                          onClick={handleFinishTest}
                          size="medium"
                          sx={{
                            backgroundColor: '#f44336',
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                            px: { xs: 1, md: 2 },
                          }}
                        >
                          Nộp bài
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          endIcon={<NavigateNext />}
                          onClick={handleNextQuestion}
                          size="medium"
                          sx={{
                            backgroundColor: categoryData.color,
                            fontSize: { xs: '0.8rem', md: '0.875rem' },
                            px: { xs: 1, md: 2 },
                          }}
                        >
                          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Câu tiếp</Box>
                          <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Tiếp</Box>
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog kết thúc test */}
        <Dialog
          open={showFinishDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              m: { xs: 2, sm: 3 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
            },
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1, px: { xs: 2, sm: 3 } }}>
            <CheckCircle sx={{ fontSize: { xs: 50, md: 60 }, color: '#4caf50', mb: 2 }} />
            <Typography
              component="div"
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
              }}
            >
              Hoàn thành bài test!
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Bạn đã hoàn thành <strong>{testData.testInfo.title}</strong>
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <Chip label={`${answeredCount}/${testData.questions.length} câu`} color="primary" size="medium" />
              <Chip
                label={formatTime(Math.max(0, parseInt(testData.testInfo.duration.split(' ')[0]) * 60 - timeLeft))}
                color="secondary"
                size="medium"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
              Kết quả sẽ được hiển thị sau khi xem lại đáp án
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              pb: 3,
              px: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              component={Link}
              href="/practice/part1"
              size="medium"
              sx={{
                order: { xs: 2, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', md: '0.875rem' },
              }}
            >
              Về trang chủ
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              size="medium"
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
              sx={{
                backgroundColor: categoryData.color,
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', md: '0.875rem' },
              }}
            >
              Xem kết quả
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog bắt đầu làm bài */}
        <Dialog 
          open={showStartDialog}
          maxWidth="sm"
          fullWidth
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              m: { xs: 2, sm: 3 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' }
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1, px: { xs: 2, sm: 3 } }}>
            <Typography 
              component="div" 
              variant="h5" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                color: categoryData?.color || '#1976d2'
              }}
            >
              🚀 Sẵn sàng làm bài?
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}
            >
              Bạn sắp bắt đầu <strong>{testData?.testInfo.title}</strong>
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="center" 
              spacing={2} 
              sx={{ mb: 3 }}
            >
              <Chip 
                label={`${testData?.testInfo.questions} câu hỏi`}
                color="primary"
                size="medium"
                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              />
              <Chip
                label={testData?.testInfo.duration || '15 phút'}
                color="secondary"
                size="medium"
                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              />
              <Chip
                label={testData?.testInfo.difficulty || 'Trung bình'}
                sx={{ 
                  backgroundColor: getDifficultyColor(testData?.testInfo.difficulty || '') + '20',
                  color: getDifficultyColor(testData?.testInfo.difficulty || ''),
                  fontSize: { xs: '0.8rem', md: '0.875rem' }
                }}
                size="medium"
              />
            </Stack>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                mb: 2
              }}
            >
              📢 Sau khi bấm &ldquo;Bắt đầu&rdquo;, đồng hồ sẽ chạy và audio câu đầu tiên sẽ tự động phát.
            </Typography>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', md: '0.8rem' },
                fontStyle: 'italic'
              }}
            >
              💡 Hãy chuẩn bị tai nghe và tìm một không gian yên tĩnh để làm bài tốt nhất.
            </Typography>
          </DialogContent>

          <DialogActions 
            sx={{ 
              justifyContent: 'center', 
              pb: 3,
              px: { xs: 2, sm: 3 }
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleStartTest}
              sx={{ 
                backgroundColor: categoryData?.color || '#1976d2',
                minWidth: 200,
                py: 1.5,
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: (categoryData?.color || '#1976d2') + 'dd',
                }
              }}
            >
              🚀 Bắt đầu làm bài
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
