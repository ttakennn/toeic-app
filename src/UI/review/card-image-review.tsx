import { Box, Typography, Stack, Chip } from '@mui/material';

import { CommonUtil } from '@/utils/common.util';

interface CardImageReviewProps {
  color: string;
  theme: string;
  currentQuestion: number;
  difficulty: string;
  imageUrl: string;
}
function CardImageReview({ color, theme, currentQuestion, difficulty, imageUrl }: CardImageReviewProps) {
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ color: color }}>
          Câu {currentQuestion}
        </Typography>
        <Chip
          label={`Chủ đề: ${theme}`}
          size="small"
          sx={{
            backgroundColor: color + '20',
            color: color,
          }}
        />
        <Chip
          label={difficulty}
          size="small"
          sx={{
            backgroundColor: CommonUtil.getDifficultyColor(difficulty) + '20',
            color: CommonUtil.getDifficultyColor(difficulty),
          }}
        />
      </Stack>
      {/* Hình ảnh */}
      <Box
        sx={{
          mb: 3,
          textAlign: 'center',
          border: '2px dashed #ddd',
          borderRadius: 2,
          p: { xs: 1, md: 2 },
          minHeight: { xs: 300, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={imageUrl || '/images/placeholder/toeic-placeholder.svg'}
          alt={`Question ${currentQuestion}`}
          sx={{
            maxWidth: '100%',
            maxHeight: { xs: 280, md: 380 },
            objectFit: 'contain',
          }}
        />
      </Box>
    </>
  );
}

export default CardImageReview;
