import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadTestProps {
  text?: string;
}
function LoadTest({ text }: LoadTestProps) {
  return (
    <DashboardLayout>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {text || 'Đang tải bài test...'}
        </Typography>
      </Box>
    </DashboardLayout>
  );
}

export default LoadTest;
