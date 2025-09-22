import { Box, LinearProgress } from '@mui/material';

interface TopProgressProps {
  currentIndex: number;
  lengthData: number;
}

function TopProgress({ currentIndex, lengthData }: TopProgressProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
      }}
    >
      <LinearProgress
        variant="determinate"
        value={((currentIndex + 1) / lengthData) * 100}
        sx={{
          height: 6,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: '#eef2f6',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #0d47a1, #1976d2)',
          },
        }}
      />
    </Box>
  );
}

export default TopProgress;
