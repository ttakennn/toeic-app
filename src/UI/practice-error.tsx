import { Box, Button, Typography } from '@mui/material';

interface PracticeErrorProps {
  error: string | null;
  isReload?: boolean;
}
function PracticeError({ error, isReload = true }: PracticeErrorProps) {
  if (!error) return null;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#ffebee',
        borderRadius: 2,
        mb: 3,
        textAlign: 'center',
      }}
    >
      <Typography color="error" variant="h6" gutterBottom>
        ⚠️ Lỗi tải dữ liệu luyện tập
      </Typography>
      <Typography color="error" variant="body2">
        {error}
      </Typography>
      {isReload && (
        <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      )}
    </Box>
  );
}

export default PracticeError;
