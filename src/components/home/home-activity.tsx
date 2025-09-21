import { Card, Typography, Chip, Stack } from '@mui/material';

function HomeActivity() {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        📚 Bạn đã sẵn sàng bắt đầu chưa?
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Hãy chọn phần bạn muốn luyện tập từ sidebar bên trái, hoặc bắt đầu với Part 1 - phần dễ nhất để làm quen với
        format thi TOEIC.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Chip label="💪 Part 1: Dễ nhất để bắt đầu" color="success" variant="filled" sx={{ fontSize: '14px', py: 2 }} />
        <Chip label="🎯 6 câu hỏi - 10 phút" color="primary" variant="outlined" sx={{ fontSize: '14px', py: 2 }} />
        <Chip
          label="🔊 Luyện nghe mô tả hình ảnh"
          color="secondary"
          variant="outlined"
          sx={{ fontSize: '14px', py: 2 }}
        />
      </Stack>
    </Card>
  );
}

export default HomeActivity;
