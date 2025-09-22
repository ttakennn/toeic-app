import { Box, Typography } from '@mui/material';

function PracticeLoadingError() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        📋 Chưa có bài luyện tập nào
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Hệ thống đang được cập nhật. Vui lòng quay lại sau.
      </Typography>
    </Box>
  );
}

export default PracticeLoadingError;
