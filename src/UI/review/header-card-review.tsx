import { CommonUtil } from '@/utils/common.util';
import { Typography, Card, CardContent, Stack, Chip } from '@mui/material';

interface HeaderCardReviewProps {
  color: string;
  title: string;
  category: string;
  correctCount: number;
  totalQuestions: number;
  score: number;
}

function HeaderCardReview({ color, title, category, correctCount, totalQuestions, score }: HeaderCardReviewProps) {
  return (
    <Card sx={{ mb: { xs: 1, sm: 3 }, backgroundColor: color + '30' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Stack>
            <Typography
              variant="h5"
              sx={{
                color: color,
                fontWeight: 600,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {CommonUtil.getCategoryEmoji(category)} Xem lại bài làm
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {title}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`${correctCount}/${totalQuestions} đúng`}
              color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}
              variant="filled"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default HeaderCardReview;
