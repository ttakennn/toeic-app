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
  Slider,
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
  NavigateBefore,
  NavigateNext,
  Flag,
  CheckCircle,
  Cancel,
  Timer,
  Error as ErrorIcon,
  Headphones,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { GuideItem } from '@/app/types/core.interface';

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
  icon: string;
  color: string;
  bgColor: string;
  guides: GuideItem;
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
  const [categoryData, setCategoryData] = useState<TestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test States
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);

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
    };
  }, [audioElement]);

  // Attach audio listeners for time/duration updates when audio element changes
  useEffect(() => {
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration || 0);
      setCurrentTime(audioElement.currentTime || 0);
    };

    const handleDurationChange = () => {
      setDuration(audioElement.duration || 0);
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('durationchange', handleDurationChange);

    // Ensure playback rate is applied to the current element
    try {
      audioElement.playbackRate = 1;
    } catch {}

    // Initialize duration if already available
    if (!Number.isNaN(audioElement.duration) && audioElement.duration) {
      setDuration(audioElement.duration);
    }

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('durationchange', handleDurationChange);
    };
  }, [audioElement]);

  // Keep playback rate in sync when it changes
  useEffect(() => {
    if (audioElement) {
      try {
        audioElement.playbackRate = 1;
      } catch {}
    }
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
        const [testResponse, categoryResponse] = await Promise.all([
          fetch(`/api/part1/questions/${category}/${testId}`),
          fetch(`/api/part1/questions/${category}`),
        ]);

        if (!testResponse.ok) {
          throw new Error(`HTTP error! status: ${testResponse.status}`);
        }

        if (!categoryResponse.ok) {
          throw new Error(`Lỗi tải thông tin category: ${categoryResponse.status}`);
        }

        const testData: TestApiResponse = await testResponse.json();
        const categoryData = await categoryResponse.json();

        if (!testData.success) {
          throw new Error('Failed to load test data');
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- audioElement is intentionally excluded to prevent double play
  }, [testData, currentQuestion, testStarted]);

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
        setCurrentTime(0);
        setDuration(0);
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
        setCurrentTime(0);
        setDuration(0);
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
            setCurrentTime(0);
            setDuration(0);
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

        // Apply current playback rate
        try {
          newAudio.playbackRate = 1;
        } catch {}

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

  // Seek and skip controls
  const handleSeek = (newTime: number) => {
    if (audioElement && !Number.isNaN(newTime)) {
      const clamped = Math.max(0, Math.min(duration || 0, newTime));
      try {
        audioElement.currentTime = clamped;
        setCurrentTime(clamped);
      } catch {}
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  // Pre-test screen
  if (!testStarted) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: { xs: '100%', md: 900 }, mx: 'auto', p: { xs: 0, sm: 3 } }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={4} alignItems="center">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom sx={{ color: categoryData?.color }}>
                    {getCategoryEmoji(category)} {testData.testInfo.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {categoryData.title}
                  </Typography>
                </Box>

                <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h3" sx={{ color: categoryData?.color, fontWeight: 'bold' }}>
                          {testData.testInfo.questions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Câu hỏi
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                          {testData.testInfo.duration}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Chip
                          label={testData.testInfo.difficulty}
                          sx={{
                            backgroundColor: getDifficultyColor(testData.testInfo.difficulty),
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            px: 2,
                            py: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Độ khó
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Headphones
                          sx={{
                            fontSize: {
                              xs: 30,
                              sm: 26,
                            },
                            color: 'primary.main',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Chỉ nghe
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Hướng dẫn làm bài */}
                <Box sx={{ width: '100%', backgroundColor: '#e3f2fd', p: 2, borderRadius: 2 }}>
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {categoryData.guides.title}
                  </Typography>

                  <Stack component="ul" spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                    {categoryData.guides.description.map((item) => (
                      <Typography
                        key={item.key}
                        component="li"
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: item.item }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {testData.testInfo.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleStartTest}
                  sx={{
                    backgroundColor: categoryData?.color,
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: categoryData?.color + 'dd',
                    },
                  }}
                >
                  Bắt đầu làm bài
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </DashboardLayout>
    );
  }

  const currentQuestionData = testData.questions.find((q) => q.id === currentQuestion);
  const progress = (currentQuestion / testData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 1, sm: 2 }, pb: { xs: 9, sm: 10 } }}>
        {/* Header với thông tin test */}
        <Card sx={{ mb: 2, backgroundColor: categoryData?.bgColor + '30' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  sx={{ color: categoryData?.color, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  {getCategoryEmoji(category)} {testData.testInfo.title}
                </Typography>
                <Chip
                  label={testData.testInfo.difficulty}
                  sx={{
                    backgroundColor: getDifficultyColor(testData.testInfo.difficulty),
                    color: 'white',
                    fontWeight: 'medium',
                  }}
                />
              </Stack>
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft <= 60 ? 'error' : timeLeft <= 180 ? 'warning' : 'primary'}
                variant="filled"
                sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}
              />
            </Stack>

            {/* Progress */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: categoryData?.color,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
                {currentQuestion}/{testData.questions.length}
              </Typography>
            </Box>
          </CardContent>
        </Card>

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
                          maxHeight: { xs: 280, md: 330, lg: 400 },
                          objectFit: 'contain',
                        }}
                      />
                    </Box>

                    {/* Audio Controls */}
                    <Box sx={{ mt: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
                        <IconButton
                          onClick={handlePlayAudio}
                          sx={{
                            backgroundColor: categoryData.color,
                            color: 'white',
                            width: { xs: 30, md: 40 },
                            height: { xs: 30, md: 40 },
                            '&:hover': {
                              backgroundColor: categoryData.color + 'dd',
                            },
                          }}
                        >
                          {isPlaying ? (
                            <Pause sx={{ fontSize: { xs: 24, md: 30 } }} />
                          ) : (
                            <PlayArrow sx={{ fontSize: { xs: 24, md: 30 } }} />
                          )}
                        </IconButton>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: { xs: 68, md: 80 }, textAlign: 'center' }}
                        >
                          {formatTime(Math.floor(currentTime || 0))} / {formatTime(Math.floor(duration || 0))}
                        </Typography>

                        <Slider
                          value={Math.min(currentTime, duration || 0)}
                          min={0}
                          max={duration || 0}
                          step={0.1}
                          onChange={(_, val) => {
                            if (typeof val === 'number') setCurrentTime(val);
                          }}
                          onChangeCommitted={(_, val) => {
                            if (typeof val === 'number') handleSeek(val);
                          }}
                          disabled={!duration}
                          sx={{ color: categoryData.color, flexGrow: 1, minWidth: 0 }}
                        />
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Controls and answers section */}
                  <Grid size={{ xs: 12, md: 6 }}>
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
                                    maxHeight: 40,
                                    backgroundColor: isSelected ? categoryData.color : 'transparent',
                                    borderColor: categoryData.color,
                                    color: isSelected ? 'white' : categoryData.color,
                                    '&:hover': {
                                      backgroundColor: isSelected
                                        ? categoryData.color + 'dd'
                                        : categoryData.color + '10',
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
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    backgroundColor: isSelected ? 'white' : 'transparent',
                                    color: isSelected ? categoryData.color : 'inherit',
                                    border: !isSelected ? `2px solid ${categoryData.color}` : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
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
            {Object.keys(answers).length < testData.questions.length && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Bạn chưa trả lời hết tất cả câu hỏi!
              </Alert>
            )}
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
              onClick={() => setShowFinishDialog(false)}
              size="medium"
              sx={{
                order: { xs: 2, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', md: '0.875rem' },
              }}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              size="medium"
              onClick={() => {
                // Generate unique key for this test session
                const uniqueKey = `part1_${category}_${testId}_${Date.now()}`;

                // Calculate results with new structure
                let correctCount = 0;
                const questionResults = testData.questions.map((question) => {
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

                const score = Math.round((correctCount / testData.questions.length) * 100);
                const timeSpent = Math.max(0, parseInt(testData.testInfo.duration.split(' ')[0]) * 60 - timeLeft);

                // Store questionResults in sessionStorage with comprehensive structure
                const resultsData = {
                  testInfo: testData.testInfo,
                  categoryInfo: categoryData,
                  questionResults,
                  score,
                  correctCount,
                  totalQuestions: testData.questions.length,
                  timeSpent,
                  submittedAt: new Date().toISOString(),
                  uniqueKey,
                };

                console.log('Storing Part 1 results to sessionStorage:', resultsData);
                
                // Store in sessionStorage
                sessionStorage.setItem(`part1_test_results_${category}_${testId}`, JSON.stringify(resultsData));
                
                // Store simplified questionResults for future reference
                sessionStorage.setItem(`questionResults_${category}_${testId}`, JSON.stringify(questionResults));
                
                // Keep backward compatibility for review page
                sessionStorage.setItem(`test_answers_${category}_${testId}`, JSON.stringify(answers));
                sessionStorage.setItem(`test_time_spent_${category}_${testId}`, timeSpent.toString());

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
