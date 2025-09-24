import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { PracticeCategory } from '@/types/core.interface';

interface TestAnswerOptionProps {
  categoryData: PracticeCategory;
  answers: { [key: number]: string };
  currentQuestion: number;
  handleAnswerSelect: (questionId: number, answer: string) => void;
}

function TestAnswerOption({ categoryData, answers, currentQuestion, handleAnswerSelect }: TestAnswerOptionProps) {
  return (
    <>
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
    </>
  );
}

export default TestAnswerOption;
