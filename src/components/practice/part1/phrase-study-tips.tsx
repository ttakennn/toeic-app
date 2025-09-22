import { Box, Typography, Chip, Stack, Paper, Grid, Divider } from '@mui/material';

function PhraseStudyTips() {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, sm: 4 },
          background: 'linear-gradient(135deg, #fff3e0 0%, #fafafa 100%)',
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'warning.light',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
          }}
        />

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'warning.dark',
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          💡 Mẹo học hiệu quả
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    1
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  <strong>Nghe nhiều lần:</strong> Phát âm ít nhất 3-5 lần để ghi nhớ cách đọc và ngữ điệu
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    2
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  <strong>Tốc độ dần:</strong> Bắt đầu với 0.5x rồi tăng dần lên 1.5x để quen với tempo thi thật
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    3
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  <strong>Từ khóa:</strong> Chú ý các động từ và danh từ chính để nhanh chóng nhận diện
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    4
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  <strong>Bookmark:</strong> Lưu lại những câu khó để ôn tập lại sau
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'warning.light' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            🎯 <strong>Mục tiêu:</strong> Nghe hiểu 100% câu trước khi chuyển sang bài tiếp theo
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="center"
            sx={{ alignItems: 'center' }}
          >
            <Chip label="Luyện tập đều đặn" size="small" color="success" variant="outlined" />
            <Chip label="Kiên trì là chìa khóa" size="small" color="primary" variant="outlined" />
            <Chip label="Tự tin vào bản thân" size="small" color="secondary" variant="outlined" />
          </Stack>
        </Box>
      </Paper>
    </>
  );
}

export default PhraseStudyTips;
