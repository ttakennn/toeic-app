import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Alert, Button, Stack } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LoadTestErrorProps {
  error: string | null;
  href: string;
}

function LoadTestError({ error, href }: LoadTestErrorProps) {
  return (
    <DashboardLayout>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Lỗi tải dữ liệu
          </Typography>
          <Typography variant="body2">{error || 'Không thể tải dữ liệu bài test. Vui lòng thử lại.'}</Typography>
        </Alert>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" component={Link} href={href}>
            Về trang chủ
          </Button>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}

export default LoadTestError;
