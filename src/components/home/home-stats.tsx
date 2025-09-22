import { Stat } from '@/types/home.interface';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface HomeStatsProps {
  stat: Stat;
}

function HomeStats({ stat }: HomeStatsProps) {
  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        p: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        border: `2px solid ${stat.color}20`,
        backgroundColor: `${stat.color}10`,
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
        <Typography
          variant="h3"
          component="div"
          sx={{
            mb: 1,
            color: stat.color,
            fontWeight: 'bold',
          }}
        >
          {stat.value}
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500 }}>
          {stat.title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default HomeStats;
