import { Grid, Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import { QuestionAnswer } from '@mui/icons-material';
import { QuestionResult } from '@/types/result.interface';

interface QuestionDetailResultProps {
  color: string;
  title: string;
  results: QuestionResult[];
  handleQuestionClick: (questionId: number) => void;
}
function QuestionDetailResult({ color, title, results, handleQuestionClick }: QuestionDetailResultProps) {
  return (
    <Grid size={{ xs: 12, md: 8 }} order={{ xs: 1, md: 1 }}>
      <Card>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: color,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <QuestionAnswer /> Chi tiết từng câu hỏi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
            💡 Click vào bất kỳ câu hỏi nào để xem chi tiết và review
          </Typography>
          <Stack spacing={2}>
            {results?.map((result: QuestionResult) => (
              <Card
                key={result.questionId}
                variant="outlined"
                sx={{
                  border: result.isCorrect ? '2px solid #4caf50' : '2px solid #f44336',
                  backgroundColor: result.isCorrect ? '#f8fff8' : '#fff8f8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    backgroundColor: result.isCorrect ? '#f0fff0' : '#fff0f0',
                  },
                }}
                onClick={() => handleQuestionClick(result.questionId)}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Stack spacing={{ xs: 2, sm: 3 }}>
                    {/* Question Header */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={`Câu ${result.questionId}`}
                          sx={{ backgroundColor: color || '#1976d2', color: 'white' }}
                        />
                        <Chip label={title} variant="outlined" size="small" />
                      </Stack>
                    </Stack>

                    {/* Question Content */}
                    <Box>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            <strong>Câu trả lời của bạn:</strong>
                          </Typography>
                          <Chip
                            label={result.userAnswer}
                            size="small"
                            sx={{
                              backgroundColor: result.isCorrect ? 'success.main' : 'error.main',
                              color: 'white',
                            }}
                          />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            <strong>Đáp án đúng:</strong>
                          </Typography>
                          <Chip
                            label={result.correctAnswer}
                            size="small"
                            sx={{
                              backgroundColor: 'success.main',
                              color: 'white',
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )) || []}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default QuestionDetailResult;
