import { QuickAccess } from '@/app/types/home.interface';
import { Box, Typography, Card, CardContent } from '@mui/material';
import Link from 'next/link';

interface HomeQuickProps {
  quick: QuickAccess;
}

function HomeQuick({ quick }: HomeQuickProps) {
  return (
    <Card
      component={Link}
      href={quick.path}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease-in-out',
        backgroundColor: quick.bgColor,
        border: `2px solid ${quick.color}20`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
          '& .quick-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
        <Box
          className="quick-icon"
          sx={{
            color: quick.color,
            mb: 3,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {quick.icon}
        </Box>

        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            color: quick.color,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {quick.title}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: '16px',
            lineHeight: 1.5,
          }}
        >
          {quick.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default HomeQuick;
