import { Card, CardContent, Typography, Stack, Box, LinearProgress, Divider } from '@mui/material';
import { CommonUtil } from '@/utils/common.util';
import { ResultsData } from '@/types/result.interface';

interface SummaryResultProps {
  results: ResultsData;
}

function SummaryResult({ results }: SummaryResultProps) {
  const scoreMessage = CommonUtil.getScoreMessage(results.score || 0);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: results.categoryInfo?.color || '#1976d2', fontWeight: 600 }}>
          📊 Thống kê
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Câu đúng</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {results.correctCount || 0}/{results.totalQuestions || 0}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={results.totalQuestions ? ((results.correctCount || 0) / results.totalQuestions) * 100 : 0}
              sx={{
                height: { xs: 8, md: 10 },
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' },
              }}
            />
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Câu sai</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                {(results.totalQuestions || 0) - (results.correctCount || 0)}/{results.totalQuestions || 0}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={
                results.totalQuestions
                  ? ((results.totalQuestions - (results.correctCount || 0)) / results.totalQuestions) * 100
                  : 0
              }
              sx={{
                height: { xs: 8, md: 10 },
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' },
              }}
            />
          </Box>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
              Điểm số:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', color: scoreMessage.color, fontSize: { xs: '0.95rem', md: '1rem' } }}
            >
              {results.score || 0}%
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}>
              Thời gian:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.95rem', md: '1rem' } }}>
              {CommonUtil.formatTimeV2(results.timeSpent || 0)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SummaryResult;
