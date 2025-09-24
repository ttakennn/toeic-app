import { Grid, Card, CardContent, Typography } from '@mui/material';
import { CommonUtil } from '@/utils/common.util';
import { CheckCircle, Cancel, Timer, Star } from '@mui/icons-material';

interface HeaderScoreResultProps {
  correctCount: number;
  totalQuestions: number;
  timeSpent: number;
  score: number;
  color: string;
}

function HeaderScoreResult({ correctCount, totalQuestions, timeSpent, score, color }: HeaderScoreResultProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle sx={{ fontSize: 30, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {correctCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Đúng
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Cancel sx={{ fontSize: 30, color: 'error.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
              {(totalQuestions || 0) - correctCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sai
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Timer sx={{ fontSize: 30, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {CommonUtil.formatTimeV2(timeSpent || 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Thời gian
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Star sx={{ fontSize: 30, color: color || '#1976d2', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: color || '#1976d2' }}>
              {score || 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Điểm số
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default HeaderScoreResult;
