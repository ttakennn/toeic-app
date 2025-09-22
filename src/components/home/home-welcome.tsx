import { Welcome } from '@/types/home.interface';
import { Assessment, PlayArrow } from '@mui/icons-material';
import { Box, Typography, Stack, Button } from '@mui/material';
import Link from 'next/link';

const PRACTICE_PATH = '/practice';
const EXAM_PATH = '/exam';

function HomeWelcome({ title, description }: Welcome) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4, lineHeight: 1.6 }}>
        {description}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          component={Link}
          href={PRACTICE_PATH}
          sx={{ minWidth: 200, backgroundColor: '#1976d2' }}
        >
          Bắt đầu học ngay
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<Assessment />}
          component={Link}
          href={EXAM_PATH}
          sx={{ minWidth: 200 }}
        >
          Làm bài thi thử
        </Button>
      </Stack>
    </Box>
  );
}

export default HomeWelcome;
