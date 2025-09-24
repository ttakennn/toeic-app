import { CommonUtil } from '@/utils/common.util';

import { Box, Typography, LinearProgress } from '@mui/material';

interface HeaderMessageResultProps {
  score: number;
  color: string;
}
function HeaderMessageResult({ score, color }: HeaderMessageResultProps) {
  const scoreMessage = CommonUtil.getScoreMessage(score || 0);

  return (
    <Box sx={{ mb: 3, mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium', fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
        {scoreMessage.message}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={score || 0}
        sx={{
          height: { xs: 10, md: 12 },
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color || '#1976d2',
            borderRadius: 6,
          },
        }}
      />
    </Box>
  );
}

export default HeaderMessageResult;
