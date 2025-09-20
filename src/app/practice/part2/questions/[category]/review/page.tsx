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
  CircularProgress,
  Slider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  PlayArrow,
  Pause,
  NavigateBefore,
  NavigateNext,
  ArrowBack,
  Headphones,
  QuestionAnswer,
  Translate,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
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

function Part2ReviewPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params?.category as string;
  const testId = searchParams?.get('testId');
  const initialQuestionIndex = searchParams?.get('questionIndex');

  const [results, setResults] = useState<TestResults | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentResult = results?.questionResults[currentQuestionIndex];

  // Translation toggle (per question panel)
  const [showTranslation, setShowTranslation] = useState(false);

  // Reset translation state when changing question
  useEffect(() => {
    setShowTranslation(false);
  }, [currentQuestionIndex]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentResult) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime || 0;
      setCurrentTime(time);
      console.log('Audio time update:', time, 'Duration:', audio.duration);
    };

    const handleLoadedMetadata = () => {
      const dur = audio.duration || 0;
      setDuration(dur);
      setCurrentTime(audio.currentTime || 0);
      console.log('Audio metadata loaded, duration:', dur);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const handleCanPlay = () => {
      setDuration(audio.duration || 0);
    };

    // Reset audio state when question changes
    setCurrentTime(0);
    setDuration(0);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);

    // Initialize duration if already available
    if (!Number.isNaN(audio.duration) && audio.duration) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentQuestionIndex, currentResult]);

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

  // Set initial question index from URL parameter
  useEffect(() => {
    if (results && initialQuestionIndex) {
      const questionIndex = parseInt(initialQuestionIndex);
      if (!isNaN(questionIndex) && questionIndex >= 0 && questionIndex < results.questionResults.length) {
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [results, initialQuestionIndex]);

  // Audio controls
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentResult) return;

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
  }, [isPlaying, currentResult]);

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setAudioError('Lỗi tải audio. Vui lòng kiểm tra kết nối mạng.');
    setIsPlaying(false);
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

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < (results?.questionResults.length || 0)) {
        // Stop current audio if playing
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setCurrentQuestionIndex(index);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    },
    [results],
  );

  const goToPreviousQuestion = () => {
    goToQuestion(currentQuestionIndex - 1);
  };

  const goToNextQuestion = () => {
    goToQuestion(currentQuestionIndex + 1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Đang tải kết quả...
            </Typography>
          </Stack>
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 0, sm: 2 } }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          component={Link}
          href={`/practice/part2/questions/${category}/results?testId=${testId}`}
          sx={{ mb: 2 }}
        >
          Xem kết quả
        </Button>
        {/* Header */}
        <Card sx={{ mb: { xs: 1, sm: 3 }, backgroundColor: results.categoryInfo.bgColor + '30' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Stack>
                <Typography
                  variant="h5"
                  sx={{
                    color: results.categoryInfo.color,
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  }}
                >
                  {getCategoryEmoji(category)} Xem lại bài làm
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {results.testInfo.title}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`${results.correctCount}/${results.totalQuestions} đúng`}
                  color={results.score >= 80 ? 'success' : results.score >= 60 ? 'warning' : 'error'}
                  variant="filled"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {/* Navigation */}
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<NavigateBefore />}
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            size="small"
          >
            Trước
          </Button>
          <Button
            variant="outlined"
            endIcon={<NavigateNext />}
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === results.questionResults.length - 1}
            size="small"
          >
            Sau
          </Button>
        </Stack>
        {/* Layout */}
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {currentResult && (
                  <>
                    {/* Question Header */}
                    <Stack
                      direction={{ xs: 'row', sm: 'row' }}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: { xs: 3, sm: 4 } }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6" sx={{ color: results.categoryInfo.color }}>
                          Câu {currentResult.questionId}
                        </Typography>
                        <Chip
                          label={currentResult.question.theme}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: results.categoryInfo.color, color: results.categoryInfo.color }}
                        />
                        <Chip
                          label={currentResult.question.difficulty}
                          size="small"
                          sx={{
                            backgroundColor: getDifficultyColor(currentResult.question.difficulty) + '20',
                            color: getDifficultyColor(currentResult.question.difficulty),
                          }}
                        />
                      </Stack>
                      {currentResult.isCorrect ? (
                        <CheckCircle sx={{ color: 'success.main' }} />
                      ) : (
                        <Cancel sx={{ color: 'error.main' }} />
                      )}
                    </Stack>
                    {/* Audio Player */}
                    <Card variant="outlined" sx={{ mb: { xs: 3, sm: 4 }, backgroundColor: '#f8f9fa' }}>
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
                              backgroundColor: results.categoryInfo.color,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: results.categoryInfo.color + 'dd',
                              },
                            }}
                          >
                            {isPlaying ? <Pause /> : <PlayArrow />}
                          </IconButton>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60, textAlign: 'center' }}>
                            {formatTime(Math.floor(currentTime || 0))} / {formatTime(Math.floor(duration || 0))}
                          </Typography>

                          <Slider
                            value={duration > 0 ? Math.min(currentTime, duration) : 0}
                            min={0}
                            max={duration || 1}
                            step={0.1}
                            onChange={(_, val) => {
                              if (typeof val === 'number') setCurrentTime(val);
                            }}
                            onChangeCommitted={(_, val) => {
                              if (typeof val === 'number') handleSeek(val);
                            }}
                            disabled={!duration || duration === 0}
                            sx={{
                              color: results.categoryInfo.color,
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
                          src={currentResult.question.audioUrl}
                          onEnded={handleAudioEnded}
                          onError={handleAudioError}
                          preload="metadata"
                        />
                      </CardContent>
                    </Card>
                    {/* Question Grid */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Danh sách câu hỏi
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          {results.questionResults.map((result, index) => (
                            <Grid size={{ xs: 3 }} key={result.questionId}>
                              <Button
                                variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                                onClick={() => goToQuestion(index)}
                                sx={{
                                  minWidth: 40,
                                  height: 40,
                                  position: 'relative',
                                  backgroundColor:
                                    currentQuestionIndex === index ? results.categoryInfo.color : 'transparent',
                                  borderColor: result.isCorrect ? 'success.main' : 'error.main',
                                  color:
                                    currentQuestionIndex === index
                                      ? 'white'
                                      : result.isCorrect
                                      ? 'success.main'
                                      : 'error.main',
                                  '&:hover': {
                                    backgroundColor:
                                      currentQuestionIndex === index
                                        ? results.categoryInfo.color + 'dd'
                                        : (result.isCorrect ? 'success.light' : 'error.light') + '20',
                                  },
                                }}
                              >
                                {index + 1}
                                {result.isCorrect ? (
                                  <CheckCircle
                                    sx={{
                                      position: 'absolute',
                                      top: -4,
                                      right: -4,
                                      fontSize: 16,
                                      color: 'success.main',
                                    }}
                                  />
                                ) : (
                                  <Cancel
                                    sx={{
                                      position: 'absolute',
                                      top: -4,
                                      right: -4,
                                      fontSize: 16,
                                      color: 'error.main',
                                    }}
                                  />
                                )}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={2}>
              {currentResult && (
                <>
                  {/* Question Transcript */}
                  <Card variant="outlined" sx={{ mb: 4 }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}
                        >
                          <QuestionAnswer /> Nội dung câu hỏi
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<Translate />}
                          onClick={() => setShowTranslation((prev) => !prev)}
                        >
                          {showTranslation ? 'Ẩn dịch' : 'Dịch'}
                        </Button>
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                        📝 {currentResult.question.question.en}
                      </Typography>
                      {showTranslation && currentResult.question.question.vi && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3 }}>
                          🇻🇳 {currentResult.question.question.vi}
                        </Typography>
                      )}

                      <Typography variant="h6" gutterBottom>
                        Các lựa chọn:
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          {
                            option: 'A',
                            text: currentResult.question.answerA.en,
                            textVN: currentResult.question.answerA.vi,
                          },
                          {
                            option: 'B',
                            text: currentResult.question.answerB.en,
                            textVN: currentResult.question.answerB.vi,
                          },
                          {
                            option: 'C',
                            text: currentResult.question.answerC.en,
                            textVN: currentResult.question.answerC.vi,
                          },
                        ].map(({ option, text, textVN }) => (
                          <Grid size={{ xs: 12 }} key={option}>
                            <Card
                              variant="outlined"
                              sx={{
                                backgroundColor:
                                  option === currentResult.correctAnswer
                                    ? '#e8f5e8'
                                    : option === currentResult.userAnswer && !currentResult.isCorrect
                                    ? '#ffebee'
                                    : 'transparent',
                                border:
                                  option === currentResult.correctAnswer
                                    ? '2px solid #4caf50'
                                    : option === currentResult.userAnswer && !currentResult.isCorrect
                                    ? '2px solid #f44336'
                                    : '1px solid #e0e0e0',
                              }}
                            >
                              <CardContent sx={{ py: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color:
                                        option === currentResult.correctAnswer
                                          ? 'success.main'
                                          : option === currentResult.userAnswer && !currentResult.isCorrect
                                          ? 'error.main'
                                          : results.categoryInfo.color,
                                      minWidth: 24,
                                    }}
                                  >
                                    {option}
                                  </Typography>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1">{text}</Typography>
                                    {showTranslation && textVN && (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontStyle: 'italic', mt: 0.5 }}
                                      >
                                        🇻🇳 {textVN}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    {option === currentResult.correctAnswer && (
                                      <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />
                                    )}
                                    {option === currentResult.userAnswer && !currentResult.isCorrect && (
                                      <Cancel sx={{ fontSize: 20, color: 'error.main' }} />
                                    )}
                                  </Stack>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                  {/* Explanation */}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        💡 Giải thích chi tiết
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {currentResult.question.explanation}
                      </Typography>

                      {/* Vocabulary */}
                      {currentResult.question.vocabulary.length > 0 && (
                        <Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                            📚 Từ vựng quan trọng:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {currentResult.question.vocabulary.map((word, index) => (
                              <Chip
                                key={index}
                                label={word}
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: results.categoryInfo.color,
                                  color: results.categoryInfo.color,
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default function Part2ReviewPage() {
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
      <Part2ReviewPageContent />
    </Suspense>
  );
}
