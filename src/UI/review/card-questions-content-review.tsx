import { Box, Typography, Card, CardContent, Button, Stack, Paper } from '@mui/material';
import { CheckCircle, Cancel, Translate, QuestionAnswer } from '@mui/icons-material';
import { TestQuestion } from '@/types/test.interface';

interface CardQuestionsContentReviewProps {
  color: string;
  currentQuestionData: TestQuestion;
  showTranslation: boolean;
  userAnswers: { [key: number]: string };
  setShowTranslation: (showTranslation: boolean) => void;
}
function CardQuestionsContentReview({
  color,
  currentQuestionData,
  showTranslation,
  userAnswers,
  setShowTranslation,
}: CardQuestionsContentReviewProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: color, display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
            <QuestionAnswer /> Nội dung câu hỏi
          </Typography>
          <Button
            variant="text"
            size="small"
            startIcon={<Translate />}
            onClick={() => setShowTranslation(!showTranslation)}
            sx={{ color: color }}
          >
            {showTranslation ? 'Ẩn dịch' : 'Dịch'}
          </Button>
        </Stack>

        <Stack spacing={{ xs: 1.5, md: 2 }}>
          {currentQuestionData?.questions.map((question) => {
            const optionLetter = String.fromCharCode(65 + question.id - 1);
            const isCorrect = optionLetter === currentQuestionData.correctAnswer;
            const userAnswer = userAnswers[currentQuestionData.id];
            const isUserAnswer = optionLetter === userAnswer;
            const isUserAnswerWrong = isUserAnswer && !isCorrect;

            return (
              <Paper
                key={question.id}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  border: isCorrect ? `2px solid #4caf50` : isUserAnswerWrong ? `2px solid #f44336` : `1px solid #ddd`,
                  backgroundColor: isCorrect ? '#e8f5e9' : isUserAnswerWrong ? '#ffebee' : 'white',
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: { xs: 28, md: 32 },
                      height: { xs: 28, md: 32 },
                      borderRadius: '50%',
                      backgroundColor: isCorrect ? '#4caf50' : isUserAnswerWrong ? '#f44336' : '#e0e0e0',
                      color: isCorrect ? 'white' : isUserAnswerWrong ? 'white' : 'black',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {optionLetter}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isCorrect || isUserAnswerWrong ? 'medium' : 'normal',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        mb: showTranslation && question.vi ? 1 : 0,
                      }}
                    >
                      {question.en}
                    </Typography>
                    {showTranslation && question.vi && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontStyle: 'italic',
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                          lineHeight: 1.4,
                        }}
                      >
                        🇻🇳 {question.vi}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {isCorrect && <CheckCircle sx={{ color: '#4caf50', fontSize: 24 }} />}
                    {isUserAnswerWrong && <Cancel sx={{ color: '#f44336', fontSize: 24 }} />}
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CardQuestionsContentReview;
