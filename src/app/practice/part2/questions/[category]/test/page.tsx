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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  NavigateBefore,
  NavigateNext,
  Flag,
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
  guides: GuideItem;
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

function Part2TestPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params?.category as string;
  const testId = searchParams?.get('testId');

  // Test data and loading state
  const [testData, setTestData] = useState<TestData | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = testData?.questions[currentQuestionIndex];

  // Audio controls
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentQuestion) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioError(null);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          setAudioError('Không thể phát audio. Vui lòng thử lại.');
          console.error('Audio play error:', error);
        });
    }
  }, [isPlaying, currentQuestion]);

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setAudioError('Lỗi tải audio. Vui lòng kiểm tra kết nối mạng.');
    setIsPlaying(false);
  };

  // Audio time and duration handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Seek functionality
  const handleSeek = (newTime: number) => {
    if (audioRef.current && !Number.isNaN(newTime)) {
      const clamped = Math.max(0, Math.min(duration || 0, newTime));
      try {
        audioRef.current.currentTime = clamped;
        setCurrentTime(clamped);
      } catch (error) {
        console.warn('Error seeking audio:', error);
      }
    }
  };

  // Question navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < (testData?.questions.length || 0)) {
        setCurrentQuestionIndex(index);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    },
    [testData],
  );

  const goToPreviousQuestion = () => {
    goToQuestion(currentQuestionIndex - 1);
  };

  const goToNextQuestion = () => {
    goToQuestion(currentQuestionIndex + 1);
  };

  // Answer handling
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Flag question
  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    );
  };

  // Test submission
  const handleSubmitTest = useCallback(() => {
    setIsTestCompleted(true);
    setShowSubmitDialog(false);

    // Calculate results
    let correctCount = 0;
    const questionResults =
      testData?.questions.map((question) => {
        const userAnswer = selectedAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) correctCount++;

        return {
          questionId: question.id,
          userAnswer: userAnswer || 'Không trả lời',
          correctAnswer: question.correctAnswer,
          isCorrect,
          question: question,
        };
      }) || [];

    const score = Math.round((correctCount / (testData?.questions.length || 1)) * 100);

    // Store results in localStorage for results page
    const results = {
      testInfo: testData?.testInfo,
      categoryInfo,
      questionResults,
      score,
      correctCount,
      totalQuestions: testData?.questions.length || 0,
      timeSpent:
        timeLeft > 0
          ? parseInt(testData?.testInfo.duration.match(/(\d+)/)?.[1] || '0') * 60 - timeLeft
          : parseInt(testData?.testInfo.duration.match(/(\d+)/)?.[1] || '0') * 60,
      submittedAt: new Date().toISOString(),
    };

    localStorage.setItem(`part2_test_results_${category}_${testId}`, JSON.stringify(results));

    // Redirect to results page
    window.location.href = `/practice/part2/questions/${category}/results?testId=${testId}`;
  }, [category, categoryInfo, selectedAnswers, testData, testId, timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      if (!category || !testId) {
        setError('Thiếu thông tin category hoặc testId');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [testResponse, categoryResponse] = await Promise.all([
          fetch(`/api/part2/questions/${category}/${testId}`),
          fetch('/api/part2/questions'),
        ]);

        if (!testResponse.ok) {
          throw new Error(`Lỗi tải test: ${testResponse.status}`);
        }

        if (!categoryResponse.ok) {
          throw new Error(`Lỗi tải thông tin category: ${categoryResponse.status}`);
        }

        const testData: TestApiResponse = await testResponse.json();
        const categoryData = await categoryResponse.json();

        if (!testData.success) {
          throw new Error('Không thể tải dữ liệu test');
        }

        setTestData(testData.data);

        // Find category info
        const catInfo = categoryData.categories?.find((cat: { id: string }) => cat.id === category);
        if (catInfo) {
          setCategoryInfo(catInfo);
        }

        // Convert duration to seconds
        const durationMatch = testData.data.testInfo.duration.match(/(\d+)\s*phút/);
        if (durationMatch) {
          setTimeLeft(parseInt(durationMatch[1]) * 60);
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [category, testId]);

  // Timer effect
  useEffect(() => {
    if (!isTestStarted || isTestCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTestCompleted(true);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeLeft, handleSubmitTest]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Đang tải bài test...
            </Typography>
          </Stack>
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !testData) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error" gutterBottom>
            Lỗi tải bài test
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" component={Link} href={`/practice/part2`} sx={{ mr: 2 }}>
            Quay về trang chủ Part 2
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  // Pre-test screen
  if (!isTestStarted) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={4} alignItems="center">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom sx={{ color: categoryInfo?.color }}>
                    {getCategoryEmoji(category)} {testData.testInfo.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {categoryInfo?.title}
                  </Typography>
                </Box>

                <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h3" sx={{ color: categoryInfo?.color, fontWeight: 'bold' }}>
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

                {categoryInfo && (
                  <Box sx={{ width: '100%', backgroundColor: '#e3f2fd', p: 2, borderRadius: 2 }}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                      {categoryInfo.guides.title}
                    </Typography>

                    <Stack component="ul" spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                      {categoryInfo.guides.description.map((item) => (
                        <Typography
                          key={item.key}
                          component="li"
                          variant="body2"
                          dangerouslySetInnerHTML={{ __html: item.item }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {testData.testInfo.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => setIsTestStarted(true)}
                  sx={{
                    backgroundColor: categoryInfo?.color,
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: categoryInfo?.color + 'dd',
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

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 0, sm: 2 } }}>
        {/* Header */}
        <Card sx={{ mb: { xs: 1, sm: 3 }, backgroundColor: categoryInfo?.bgColor + '30' }}>
          <CardContent>
            <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              {/* Title */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h5" sx={{ color: categoryInfo?.color, fontWeight: 600 }}>
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
              {/* Timer */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<Timer />}
                  label={formatTime(timeLeft)}
                  color={timeLeft <= 60 ? 'error' : timeLeft <= 180 ? 'warning' : 'primary'}
                  variant="filled"
                  sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                />
              </Stack>
            </Stack>
            {/* Progress */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={((currentQuestionIndex + 1) / testData.questions.length) * 100}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: categoryInfo?.color,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {currentQuestionIndex + 1}/{testData.questions.length}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {/* Main Question Area */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {currentQuestion && (
                  <>
                    {/* Question Header */}
                    <Stack
                      direction={{ xs: 'row', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'center', sm: 'center' }}
                      sx={{ mb: 1 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6" sx={{ color: categoryInfo?.color }}>
                          Câu {currentQuestion.id}
                        </Typography>
                        <Chip
                          label={currentQuestion.theme}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: categoryInfo?.color, color: categoryInfo?.color }}
                        />
                      </Stack>
                      <IconButton
                        onClick={() => toggleFlag(currentQuestion.id)}
                        sx={{
                          color: flaggedQuestions.includes(currentQuestion.id) ? 'warning.main' : 'grey.400',
                          alignSelf: { xs: 'flex-end', sm: 'center' },
                        }}
                      >
                        <Flag />
                      </IconButton>
                    </Stack>

                    {/* Audio Player */}
                    <Card variant="outlined" sx={{ mb: { xs: 0, sm: 1 }, backgroundColor: '#f8f9fa' }}>
                      <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
                          <Headphones sx={{ fontSize: { xs: 24, sm: 30 }, color: 'primary.main' }} />
                          <Typography variant="h6" gutterBottom>
                            Nghe câu hỏi và đáp án
                          </Typography>
                        </Stack>
                        {/* Audio Controls with Slider */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 2 }}>
                          {/* responsive icon button */}
                          <IconButton
                            onClick={togglePlayPause}
                            size="large"
                            sx={{
                              width: { xs: 30, sm: 40 },
                              height: { xs: 30, sm: 40 },
                              backgroundColor: categoryInfo?.color,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: categoryInfo?.color + 'dd',
                              },
                            }}
                          >
                            {isPlaying ? <Pause /> : <PlayArrow />}
                          </IconButton>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60, textAlign: 'center' }}>
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
                            sx={{
                              color: categoryInfo?.color,
                              flexGrow: 1,
                              '& .MuiSlider-thumb': {
                                width: 16,
                                height: 16,
                              },
                              '& .MuiSlider-track': {
                                height: 4,
                              },
                              '& .MuiSlider-rail': {
                                height: 4,
                              },
                            }}
                          />
                        </Stack>

                        {audioError && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            {audioError}
                          </Alert>
                        )}

                        {/* Hidden audio element */}
                        <audio
                          ref={audioRef}
                          src={currentQuestion.audioUrl}
                          onEnded={handleAudioEnded}
                          onError={handleAudioError}
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onDurationChange={handleDurationChange}
                          preload="metadata"
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }} spacing={{ xs: 1, sm: 2 }}>
            <Stack spacing={2} direction={{xs: 'column-reverse', sm: 'column'}}>
              {/* Navigation */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Điều hướng
                  </Typography>
                  {/* hiện button nộp bài nếu là câu cuối */}

                  <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<NavigateBefore />}
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      size="small"
                    >
                      Trước
                    </Button>
                    {currentQuestionIndex === testData.questions.length - 1 ? (
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={() => setShowSubmitDialog(true)}
                        sx={{
                          backgroundColor: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.dark',
                          },
                        }}
                      >
                        <Flag />
                        Nộp bài
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<NavigateNext />}
                        onClick={goToNextQuestion}
                        disabled={currentQuestionIndex === testData.questions.length - 1}
                        size="small"
                      >
                        Sau
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
              {/* Answer Options */}
              {currentQuestion && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Chọn đáp án:
                    </Typography>

                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                      <RadioGroup
                        value={selectedAnswers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                      >
                        <Stack spacing={2} direction="row">
                          {['A', 'B', 'C'].map((option) => (
                            <Box
                              key={option}
                              sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                width: '100%',
                                borderRadius: 2,
                                border:
                                  selectedAnswers[currentQuestion.id] === option
                                    ? `2px solid ${categoryInfo?.color}`
                                    : '1px solid #e0e0e0',
                                backgroundColor:
                                  selectedAnswers[currentQuestion.id] === option
                                    ? categoryInfo?.bgColor + '20'
                                    : 'transparent',
                                '&:hover': {
                                  backgroundColor: categoryInfo?.bgColor + '40',
                                },
                              }}
                              onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                            >
                              <FormControlLabel
                                value={option}
                                control={<Radio sx={{ color: categoryInfo?.color }} />}
                                label={
                                  <Box>
                                    <Typography variant="h6" sx={{ color: categoryInfo?.color }}>
                                      {option}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ width: '100%', margin: 0 }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Submit Dialog */}
        <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
          <DialogTitle>Xác nhận nộp bài</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Bạn có chắc chắn muốn nộp bài không?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Đã trả lời: {Object.keys(selectedAnswers).length}/{testData.questions.length} câu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Thời gian còn lại: {formatTime(timeLeft)}
            </Typography>
            {Object.keys(selectedAnswers).length < testData.questions.length && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Bạn chưa trả lời hết tất cả câu hỏi!
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSubmitDialog(false)}>Hủy</Button>
            <Button onClick={handleSubmitTest} variant="contained" color="success">
              Nộp bài
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}

export default function Part2TestPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </DashboardLayout>
      }
    >
      <Part2TestPageContent />
    </Suspense>
  );
}
