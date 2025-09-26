import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadResultProps {
  text?: string;
}
function LoadResult({ text }: LoadResultProps) {
  return (
    <DashboardLayout>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {text || 'Đang tải kết quả...'}
        </Typography>
      </Box>
    </DashboardLayout>
  );
}

export default LoadResult;
