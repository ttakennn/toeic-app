import { Box, Typography, Card, CardContent, Stack, Chip, Alert } from '@mui/material';

import { TestQuestion } from '@/types/test.interface';

interface CardExplainReviewProps {
  color: string;
  currentQuestionData: TestQuestion;
}
function CardExplainReview({ color, currentQuestionData }: CardExplainReviewProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: color }}>
          💡 Giải thích đáp án
        </Typography>

        <Alert severity="success" sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Đáp án đúng: {currentQuestionData?.correctAnswer}</strong>
          </Typography>
          <Box>{currentQuestionData?.explanation}</Box>
        </Alert>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, color: color }}>
            📚 Từ vựng quan trọng:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {currentQuestionData?.vocabulary.map((word: string, index: number) => (
              <Chip
                key={index}
                label={word}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: color,
                  color: color,
                }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CardExplainReview;
