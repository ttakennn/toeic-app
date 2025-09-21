import { Card, Box, Typography, Grid, Button } from '@mui/material';
import Link from 'next/link';

function HomeHighlight() {
  return (
    <Card
      sx={{
        p: 4,
        mb: 6,
        background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          🎯 Tại sao chọn Ken TOEIC?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Hệ thống học tập khoa học:</strong> Từ Part 1 đến Part 7, mỗi phần được thiết kế chi tiết
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Giao diện thân thiện:</strong> Dễ sử dụng trên mọi thiết bị
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Theo dõi tiến độ:</strong> Biết rõ bạn đã học được bao nhiều
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Audio chất lượng cao:</strong> Luyện nghe với giọng chuẩn
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Từ vựng theo chủ đề:</strong> Học hiệu quả hơn với phân loại rõ ràng
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
              • <strong>Thi thử thực tế:</strong> Mô phỏng hoàn toàn kỳ thi TOEIC
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/practice"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              minWidth: 200,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Khám phá ngay! 🎉
          </Button>
        </Box>
      </Box>
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.05)',
          zIndex: 0,
        }}
      />
    </Card>
  );
}

export default HomeHighlight;
