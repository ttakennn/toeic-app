import { PlayArrow } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { Button } from '@mui/material';
import Link from 'next/link';

function PracticeBottomCta() {
  return (
    <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        🎓 Sẵn sàng nâng cao điểm TOEIC?
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Hãy bắt đầu với Part 1 để làm quen với format bài thi và xây dựng nền tảng vững chắc
      </Typography>
      <Button
        variant="contained"
        size="large"
        component={Link}
        href="/practice/part1"
        startIcon={<PlayArrow />}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        Bắt đầu với Part 1
      </Button>
    </Box>
  );
}

export default PracticeBottomCta;
