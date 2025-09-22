import { Box, Button, Stack, Typography } from '@mui/material';

interface PracticeActionProps {
  title: string;
  description: string;
}

function PracticeAction({ title, description }: PracticeActionProps) {
  return (
    <Box
      sx={{
        mt: 6,
        p: 4,
        background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
        borderRadius: 3,
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
        {description}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'white',
            color: 'primary.main',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Bắt đầu luyện tập
        </Button>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Xem hướng dẫn
        </Button>
      </Stack>
    </Box>
  );
}

export default PracticeAction;
