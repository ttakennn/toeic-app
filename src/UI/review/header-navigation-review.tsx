import { Button, Stack } from '@mui/material';
import { NavigateBefore, NavigateNext, ViewComfy } from '@mui/icons-material';

interface HeaderNavigationReviewProps {
  color: string;
  currentQuestion: number;
  testQuestionLength: number;
  handleBackToResults: () => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
}

function HeaderNavigationReview({
  color,
  currentQuestion,
  testQuestionLength,
  handleBackToResults,
  handlePrevQuestion,
  handleNextQuestion,
}: HeaderNavigationReviewProps) {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{ mb: 2, display: { xs: 'none', md: 'flex' } }}
    >
      <Button
        size="small"
        variant="contained"
        startIcon={<ViewComfy />}
        onClick={handleBackToResults}
        sx={{ mb: 2, backgroundColor: color }}
      >
        Xem kết quả
      </Button>
      <Button
        variant="outlined"
        startIcon={<NavigateBefore />}
        onClick={handlePrevQuestion}
        disabled={currentQuestion === 1}
        size="small"
      >
        Trước
      </Button>
      <Button
        variant="outlined"
        endIcon={<NavigateNext />}
        onClick={handleNextQuestion}
        disabled={currentQuestion === testQuestionLength}
        size="small"
      >
        Sau
      </Button>
    </Stack>
  );
}

export default HeaderNavigationReview;
