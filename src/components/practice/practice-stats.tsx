import { PracticeStats as IPracticeStats } from '@/types/practice.interface';
import { Typography, Card } from '@mui/material';

interface PracticeStatsProps {
  stat: IPracticeStats;
}

function PracticeStats({ stat }: PracticeStatsProps) {
  return (
    <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
      <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
        {stat.value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {stat.title}
      </Typography>
    </Card>
  );
}

export default PracticeStats;
