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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  NavigateBefore,
  NavigateNext,
  Flag,
  CheckCircle,
  Timer,
  Error as ErrorIcon,
  Headphones,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

interface TestQuestion {
  id: number;
  audioUrl: string;
  correctAnswer: string;
  explanation: string;
  questionTranscript: string;
  optionA_Transcript: string;
  optionB_Transcript: string;
  optionC_Transcript: string;
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = testData?.questions[currentQuestionIndex];

  // Mobile bottom nav visibility on scroll
  const [showMobileNav, setShowMobileNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current) {
        setShowMobileNav(true);
      } else {
        setShowMobileNav(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Question navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < (testData?.questions.length || 0)) {
        setCurrentQuestionIndex(index);
        setIsPlaying(false);
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
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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

                <Alert severity="info" sx={{ width: '100%' }}>
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    📋 Hướng dẫn làm bài:
                  </Typography>
                  <Stack component="ul" spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                    <Typography component="li" variant="body2">
                      🎧 Nghe câu hỏi và 3 đáp án A, B, C chỉ được phát <strong>1 lần duy nhất</strong>
                    </Typography>
                    <Typography component="li" variant="body2">
                      ✅ Chọn đáp án phù hợp nhất với câu hỏi
                    </Typography>
                    <Typography component="li" variant="body2">
                      🚩 Bạn có thể đánh dấu câu hỏi để xem lại sau
                    </Typography>
                    <Typography component="li" variant="body2">
                      ⏰ Hết thời gian sẽ tự động nộp bài
                    </Typography>
                    <Typography component="li" variant="body2">
                      📝 <strong>Không có text hiển thị</strong> - hoàn toàn dựa vào nghe hiểu
                    </Typography>
                  </Stack>
                </Alert>

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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 2 }, pb: { xs: 9, sm: 10 } }}>
        {/* Header */}
        <Card sx={{ mb: 3, backgroundColor: categoryInfo?.bgColor + '30' }}>
          <CardContent>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
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

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  icon={<Timer />}
                  label={formatTime(timeLeft)}
                  color={timeLeft <= 60 ? 'error' : timeLeft <= 180 ? 'warning' : 'primary'}
                  variant="filled"
                  sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {currentQuestionIndex + 1}/{testData.questions.length}
                </Typography>
              </Stack>
            </Stack>

            {/* Progress */}
            <LinearProgress
              variant="determinate"
              value={((currentQuestionIndex + 1) / testData.questions.length) * 100}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: categoryInfo?.color,
                },
              }}
            />
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Main Question Area */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {currentQuestion && (
                  <>
                    {/* Question Header */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      sx={{ mb: { xs: 3, sm: 4 } }}
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
                    <Card variant="outlined" sx={{ mb: { xs: 3, sm: 4 }, backgroundColor: '#f8f9fa' }}>
                      <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                        <Headphones sx={{ fontSize: { xs: 50, sm: 60 }, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          🎧 Nghe câu hỏi và đáp án
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Câu hỏi và 3 đáp án A, B, C sẽ được đọc liên tiếp
                        </Typography>

                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                          <IconButton
                            onClick={togglePlayPause}
                            size="large"
                            sx={{
                              backgroundColor: categoryInfo?.color,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: categoryInfo?.color + 'dd',
                              },
                            }}
                          >
                            {isPlaying ? <Pause /> : <PlayArrow />}
                          </IconButton>
                          <VolumeUp sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {isPlaying ? 'Đang phát...' : 'Nhấn để phát'}
                          </Typography>
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
                          preload="metadata"
                        />
                      </CardContent>
                    </Card>

                    {/* Answer Options */}
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
                            <Stack spacing={2}>
                              {['A', 'B', 'C'].map((option) => (
                                <Card
                                  key={option}
                                  variant="outlined"
                                  sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
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
                                  <CardContent sx={{ py: 2 }}>
                                    <FormControlLabel
                                      value={option}
                                      control={<Radio sx={{ color: categoryInfo?.color }} />}
                                      label={
                                        <Box>
                                          <Typography variant="h6" sx={{ color: categoryInfo?.color }}>
                                            {option}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            Nghe trong audio
                                          </Typography>
                                        </Box>
                                      }
                                      sx={{ width: '100%', margin: 0 }}
                                    />
                                  </CardContent>
                                </Card>
                              ))}
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              {/* Navigation */}
              <Card sx={{ display: { xs: 'none', md: 'block' } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Điều hướng
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<NavigateBefore />}
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      size="small"
                      sx={{ flex: 1 }}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outlined"
                      endIcon={<NavigateNext />}
                      onClick={goToNextQuestion}
                      disabled={currentQuestionIndex === testData.questions.length - 1}
                      size="small"
                      sx={{ flex: 1 }}
                    >
                      Sau
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Question Grid */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Danh sách câu hỏi
                  </Typography>
                  <Grid container spacing={1}>
                    {testData.questions.map((question, index) => (
                      <Grid size={{ xs: 3 }} key={question.id}>
                        <Button
                          variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                          onClick={() => goToQuestion(index)}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            position: 'relative',
                            backgroundColor: currentQuestionIndex === index ? categoryInfo?.color : 'transparent',
                            borderColor: selectedAnswers[question.id] ? categoryInfo?.color : '#e0e0e0',
                            '&:hover': {
                              backgroundColor:
                                currentQuestionIndex === index
                                  ? categoryInfo?.color + 'dd'
                                  : categoryInfo?.bgColor + '40',
                            },
                          }}
                        >
                          {index + 1}
                          {selectedAnswers[question.id] && (
                            <CheckCircle
                              sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                fontSize: 16,
                                color: 'success.main',
                              }}
                            />
                          )}
                          {flaggedQuestions.includes(question.id) && (
                            <Flag
                              sx={{
                                position: 'absolute',
                                top: -4,
                                left: -4,
                                fontSize: 16,
                                color: 'warning.main',
                              }}
                            />
                          )}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tiến độ
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Đã trả lời:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {Object.keys(selectedAnswers).length}/{testData.questions.length}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Đã đánh dấu:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {flaggedQuestions.length}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(Object.keys(selectedAnswers).length / testData.questions.length) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => setShowSubmitDialog(true)}
                    sx={{
                      backgroundColor: 'success.main',
                      '&:hover': {
                        backgroundColor: 'success.dark',
                      },
                    }}
                  >
                    Nộp bài
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Mobile Bottom Navigation */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: showMobileNav ? 'auto' : 'none',
            transform: showMobileNav ? 'translateY(0)' : 'translateY(120%)',
            opacity: showMobileNav ? 1 : 0,
            transition: 'transform 200ms ease, opacity 200ms ease',
            zIndex: 1200,
          }}
        >
          <Card elevation={6} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<NavigateBefore />}
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  fullWidth
                  size="large"
                >
                  Trước
                </Button>
                <Button
                  variant="contained"
                  endIcon={<NavigateNext />}
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === (testData?.questions.length || 1) - 1}
                  fullWidth
                  size="large"
                >
                  Sau
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>

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
