import { Box, Typography, Card, CardContent, Grid, Button, Stack, Chip, IconButton, Slider } from '@mui/material';
import { PlayArrow, Pause, NavigateBefore, NavigateNext, Flag, Timer } from '@mui/icons-material';
import TopProgress from '@/UI/top-progress';
import { TestData, TestQuestion } from '@/types/test.interface';
import { PracticeCategory } from '@/types/core.interface';

interface TestLayoutProps {
  currentQuestion: number;
  testData: TestData;
  categoryData: PracticeCategory;
  timeLeft: number;
  currentQuestionData: TestQuestion | undefined;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  answers: { [key: number]: string };
  handlePlayAudio: () => void;
  handleSeek: (newTime: number) => void;
  handleAnswerSelect: (questionId: number, answer: string) => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleFinishTest: () => void;
  setCurrentTime: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function TestLayout({
  currentQuestion,
  testData,
  categoryData,
  timeLeft,
  currentQuestionData,
  isPlaying,
  currentTime,
  duration,
  answers,
  handlePlayAudio,
  handleSeek,
  handleAnswerSelect,
  handlePrevQuestion,
  handleNextQuestion,
  handleFinishTest,
  setCurrentTime,
}: TestLayoutProps) {
  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ position: 'relative' }}>
          <TopProgress
            currentIndex={currentQuestion}
            lengthData={testData.questions.length}
            color={categoryData.color}
          />
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: categoryData.color,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                  }}
                >
                  {testData.testInfo.title} {currentQuestion}/{testData.questions.length}
                </Typography>
              </Stack>
              <Chip
                icon={<Timer />}
                label={formatTime(timeLeft)}
                color={timeLeft <= 60 ? 'error' : timeLeft <= 180 ? 'warning' : 'primary'}
                variant="filled"
                sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '1rem' } }}
              />
            </Stack>

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
  );
}

export default TestLayout;
