import { Box, Button, Stack } from '@mui/material';
import { NavigateBefore, NavigateNext, Flag } from '@mui/icons-material';

interface TestNavigationButtonProps {
  color: string;
  currentQuestion: number;
  testQuestionLength: number;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleFinishTest: () => void;
}

function TestNavigationButton({
  color,
  currentQuestion,
  testQuestionLength,
  handlePrevQuestion,
  handleNextQuestion,
  handleFinishTest,
}: TestNavigationButtonProps) {
  return (
    <Stack direction="row" spacing={{ xs: 1, md: 2 }} justifyContent="space-between">
      <Button
        variant="outlined"
        startIcon={<NavigateBefore />}
        onClick={handlePrevQuestion}
        disabled={currentQuestion === 1}
        size="medium"
        sx={{
          color: color,
          borderColor: color,
          fontSize: { xs: '0.8rem', md: '0.875rem' },
          px: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Câu trước</Box>
        <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Trước</Box>
      </Button>

      {currentQuestion === testQuestionLength ? (
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
            backgroundColor: color,
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            px: { xs: 1, md: 2 },
          }}
        >
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Câu tiếp</Box>
          <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Tiếp</Box>
        </Button>
      )}
    </Stack>
  );
}

export default TestNavigationButton;
