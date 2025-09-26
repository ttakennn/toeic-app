import { Stack, Box, Typography, Avatar } from '@mui/material';
import { CommonUtil } from '@/utils/common.util';

interface HeaderTestResultProps {
  category: string;
  title: string;
  color: string;
  score: number;
}

function HeaderTestResult({ category, title, color, score }: HeaderTestResultProps) {
  return (
    <Stack
      direction={{ xs: 'row', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      sx={{ mb: { xs: 2, md: 3 } }}
      spacing={{ xs: 1.25, md: 0 }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
            {CommonUtil.getCategoryEmoji(category)} Kết quả bài test
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {title}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: { xs: 60, sm: 80 },
            height: { xs: 60, sm: 80 },
            backgroundColor: color || '#1976d2',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 'bold',
            alignSelf: { xs: 'center', sm: 'auto' },
          }}
        >
          {score || 0}%
        </Avatar>
      </Stack>
    </Stack>
  );
}

export default HeaderTestResult;
