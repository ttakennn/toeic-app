import { Box, Typography, Button, Alert, Stack } from '@mui/material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowBack, Repeat, Error as ErrorIcon } from '@mui/icons-material';

interface PhraseCategoryDetailErrorProps {
  error: string | null;
  backMessage: string;
  onGoBack: () => void;
}

function PhraseCategoryDetailError({ error, backMessage, onGoBack }: PhraseCategoryDetailErrorProps) {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', py: 8 }}>
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{
            mb: 4,
            '& .MuiAlert-message': {
              fontSize: '1.1rem',
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            😔 Không thể tải dữ liệu
          </Typography>
          <Typography variant="body1">{error || 'Không thể tải dữ liệu. Vui lòng thử lại.'}</Typography>
        </Alert>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => window.location.reload()} startIcon={<Repeat />}>
            Thử lại
          </Button>
          <Button variant="outlined" onClick={onGoBack} startIcon={<ArrowBack />}>
            {backMessage}
          </Button>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}

export default PhraseCategoryDetailError;
