import { CardContent, Card, Box, Skeleton, CircularProgress, Typography } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';

function PhraseCategoryDetailSkeleton() {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 2, borderRadius: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 2 }} />
        </Box>

        {/* Main Card Skeleton */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4, mb: 4 }} />
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 4 }} />
              <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 20 }} />
                <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 20 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ mr: 2 }} />
          <Typography variant="h6" color="primary.main">
            Đang tải dữ liệu...
          </Typography>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default PhraseCategoryDetailSkeleton;
