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
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  PlayArrow,
  Pause,
  VolumeUp,
  NavigateBefore,
  NavigateNext,
  ArrowBack,
  Headphones,
  QuestionAnswer,
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
    correctAnswer: string;
    explanation: string;
    questionTranscript: string;
    optionA_Transcript: string;
    optionB_Transcript: string;
    optionC_Transcript: string;
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
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentResult = results?.questionResults[currentQuestionIndex];

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
      audioRef.current.play()
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

  // Navigation
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < (results?.questionResults.length || 0)) {
      setCurrentQuestionIndex(index);
      setIsPlaying(false);
    }
  }, [results]);

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
        <Card sx={{ mb: { xs: 2, sm: 3, md: 4 }, backgroundColor: results.categoryInfo.bgColor + '30' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Stack>
                <Typography 
                  variant="h5"
                  sx={{ 
                    color: results.categoryInfo.color, 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {getCategoryEmoji(category)} Xem lại bài làm
                </Typography>
                <Typography 
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {results.testInfo.title}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={`${results.correctCount}/${results.totalQuestions} đúng`}
                  color={results.score >= 80 ? 'success' : results.score >= 60 ? 'warning' : 'error'}
                  variant="filled"
                />
                <Typography variant="body2" color="text.secondary">
                  {currentQuestionIndex + 1}/{results.questionResults.length}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {currentResult && (
                  <>
                    {/* Question Header */}
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={2} 
                      alignItems={{ xs: 'flex-start', sm: 'center' }} 
                      sx={{ mb: { xs: 3, sm: 4 } }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
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
                            color: getDifficultyColor(currentResult.question.difficulty)
                          }}
                        />
                      </Stack>
                      {currentResult.isCorrect ? (
                        <CheckCircle sx={{ color: 'success.main', alignSelf: { xs: 'flex-end', sm: 'center' } }} />
                      ) : (
                        <Cancel sx={{ color: 'error.main', alignSelf: { xs: 'flex-end', sm: 'center' } }} />
                      )}
                    </Stack>

                    {/* Audio Player */}
                    <Card variant="outlined" sx={{ mb: { xs: 3, sm: 4 }, backgroundColor: '#f8f9fa' }}>
                      <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                        <Headphones sx={{ fontSize: { xs: 50, sm: 60 }, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          🎧 Nghe lại câu hỏi và đáp án
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Câu hỏi và 3 đáp án A, B, C
                        </Typography>

                        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                          <IconButton
                            onClick={togglePlayPause}
                            size="large"
                            sx={{
                              backgroundColor: results.categoryInfo.color,
                              color: 'white',
                              '&:hover': {
                                backgroundColor: results.categoryInfo.color + 'dd'
                              }
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
                          src={currentResult.question.audioUrl}
                          onEnded={handleAudioEnded}
                          onError={handleAudioError}
                          preload="metadata"
                        />
                      </CardContent>
                    </Card>

                    {/* Question Transcript */}
                    <Card variant="outlined" sx={{ mb: 4 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QuestionAnswer /> Nội dung câu hỏi
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 3 }}>
                          📝 {currentResult.question.questionTranscript}
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                          Các lựa chọn:
                        </Typography>
                        <Grid container spacing={2}>
                          {[
                            { option: 'A', text: currentResult.question.optionA_Transcript },
                            { option: 'B', text: currentResult.question.optionB_Transcript },
                            { option: 'C', text: currentResult.question.optionC_Transcript }
                          ].map(({ option, text }) => (
                            <Grid size={{ xs: 12 }} key={option}>
                              <Card
                                variant="outlined"
                                sx={{
                                  backgroundColor: 
                                    option === currentResult.correctAnswer ? '#e8f5e8' :
                                    option === currentResult.userAnswer && !currentResult.isCorrect ? '#ffebee' :
                                    'transparent',
                                  border:
                                    option === currentResult.correctAnswer ? '2px solid #4caf50' :
                                    option === currentResult.userAnswer && !currentResult.isCorrect ? '2px solid #f44336' :
                                    '1px solid #e0e0e0'
                                }}
                              >
                                <CardContent sx={{ py: 2 }}>
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h6" sx={{ 
                                      color: 
                                        option === currentResult.correctAnswer ? 'success.main' :
                                        option === currentResult.userAnswer && !currentResult.isCorrect ? 'error.main' :
                                        results.categoryInfo.color,
                                      minWidth: 24
                                    }}>
                                      {option}
                                    </Typography>
                                    <Typography variant="body1" sx={{ flex: 1 }}>
                                      {text}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      {option === currentResult.correctAnswer && (
                                        <Chip
                                          label="Đáp án đúng"
                                          size="small"
                                          sx={{
                                            backgroundColor: 'success.main',
                                            color: 'white',
                                            display: { xs: 'none', md: 'block' }
                                          }}
                                        />
                                      )}
                                      {option === currentResult.userAnswer && option !== currentResult.correctAnswer && (
                                        <Chip
                                          label="Bạn đã chọn"
                                          size="small"
                                          sx={{
                                            backgroundColor: 'error.main',
                                            color: 'white'
                                          }}
                                        />
                                      )}
                                      {option === currentResult.userAnswer && option === currentResult.correctAnswer && (
                                        <Chip
                                          label="Bạn đã chọn đúng"
                                          size="small"
                                          sx={{
                                            backgroundColor: 'success.main',
                                            color: 'white'
                                          }}
                                        />
                                      )}
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
                                    color: results.categoryInfo.color
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
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              {/* Navigation */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Điều hướng
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
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
                </CardContent>
              </Card>

              {/* Question Grid */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Danh sách câu hỏi
                  </Typography>
                  <Grid container spacing={1}>
                    {results.questionResults.map((result, index) => (
                      <Grid size={{ xs: 3 }} key={result.questionId}>
                        <Button
                          variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                          onClick={() => goToQuestion(index)}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            position: 'relative',
                            backgroundColor: currentQuestionIndex === index ? results.categoryInfo.color : 'transparent',
                            borderColor: result.isCorrect ? 'success.main' : 'error.main',
                            color: currentQuestionIndex === index ? 'white' : (result.isCorrect ? 'success.main' : 'error.main'),
                            '&:hover': {
                              backgroundColor: currentQuestionIndex === index ? results.categoryInfo.color + 'dd' : (result.isCorrect ? 'success.light' : 'error.light') + '20'
                            }
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
                                color: 'success.main'
                              }}
                            />
                          ) : (
                            <Cancel
                              sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                fontSize: 16,
                                color: 'error.main'
                              }}
                            />
                          )}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tóm tắt kết quả
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Tổng số câu:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {results.totalQuestions}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'success.main' }}>Trả lời đúng:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                        {results.correctCount}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'error.main' }}>Trả lời sai:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'error.main' }}>
                        {results.totalQuestions - results.correctCount}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Điểm số:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {results.score}%
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      component={Link}
                      href={`/practice/part2/questions/${category}/results?testId=${testId}`}
                      fullWidth
                    >
                      Xem kết quả
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      href={`/practice/part2/questions/${category}/test?testId=${testId}`}
                      fullWidth
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
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default function Part2ReviewPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    }>
      <Part2ReviewPageContent />
    </Suspense>
  );
}
