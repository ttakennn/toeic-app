import { Card, CardContent, Typography, Stack, Button } from '@mui/material';
import { Refresh, TrendingUp, Home } from '@mui/icons-material';
import Link from 'next/link';
import { ResultsData } from '@/types/result.interface';

interface ActionResultProps {
  reworkHref: string;
  reviewHref: string;
  results: ResultsData;
}

function ActionResult({ reworkHref, reviewHref, results }: ActionResultProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: results.categoryInfo?.color || '#1976d2', fontWeight: 600 }}>
          🎯 Tiếp theo
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Refresh />}
            component={Link}
            href={reworkHref}
            sx={{
              backgroundColor: results.categoryInfo?.color || '#1976d2',
              fontSize: { xs: '0.95rem', md: '1rem' },
              py: { xs: 1, md: 1.25 },
            }}
          >
            Làm lại bài test
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<TrendingUp />}
            component={Link}
            href={reviewHref}
            sx={{
              borderColor: results.categoryInfo?.color || '#1976d2',
              color: results.categoryInfo?.color || '#1976d2',
              fontSize: { xs: '0.95rem', md: '1rem' },
              py: { xs: 1, md: 1.25 },
            }}
          >
            Chọn bài test khác
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<Home />}
            component={Link}
            href="/"
            sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, py: { xs: 1, md: 1.25 } }}
          >
            Về trang chủ
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ActionResult;
