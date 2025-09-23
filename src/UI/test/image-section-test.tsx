import { Box } from '@mui/material';

interface ImageSectionTestProps {
  imageUrl: string;
  currentQuestion: number;
}

function ImageSectionTest({ imageUrl, currentQuestion }: ImageSectionTestProps) {
  return (
    <>
      <Box
        sx={{
          textAlign: 'center',
          border: '2px dashed #ddd',
          borderRadius: 2,
          p: { xs: 1, md: 2 },
          minHeight: { xs: 300, md: 350 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: { xs: 2, md: 0 },
        }}
      >
        <Box
          component="img"
          src={imageUrl || '/images/placeholder/toeic-placeholder.svg'}
          alt={`Question ${currentQuestion}`}
          sx={{
            maxWidth: '100%',
            maxHeight: { xs: 280, md: 330, lg: 400 },
            objectFit: 'contain',
          }}
        />
      </Box>
    </>
  );
}

export default ImageSectionTest;
