import { Box, Typography, Card, CardContent, Button, Stack, Chip } from '@mui/material';
import { PracticeArea as IPracticeArea } from '@/app/types/practice.interface';
import Link from 'next/link';

interface PracticeAreasProps {
  area: IPracticeArea;
}

function PracticeAreas({ area }: PracticeAreasProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: area.bgColor,
          }}
        >
          <Box sx={{ color: area.color, mr: 2 }}>{area.icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: area.color }}>
            {area.title}
          </Typography>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
          {area.description}
        </Typography>

        {/* Info */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1}>
            <Chip label={area.totalTests} size="small" sx={{ backgroundColor: area.bgColor, color: area.color }} />
            <Chip
              label={area.difficulty}
              size="small"
              variant="outlined"
              sx={{ borderColor: area.color, color: area.color }}
            />
          </Stack>
        </Stack>

        {/* Action Button */}
        <Button
          variant={area.totalTests.includes('Sắp') ? 'outlined' : 'contained'}
          component={area.totalTests.includes('Sắp') ? 'button' : Link}
          href={area.totalTests.includes('Sắp') ? undefined : area.path}
          disabled={area.totalTests.includes('Sắp')}
          fullWidth
          sx={{
            mt: 'auto',
            py: 1.5,
            backgroundColor: area.totalTests.includes('Sắp') ? 'transparent' : area.color,
            borderColor: area.color,
            color: area.totalTests.includes('Sắp') ? area.color : 'white',
            '&:hover': {
              backgroundColor: area.totalTests.includes('Sắp') ? area.bgColor : area.color + 'dd',
            },
          }}
        >
          {area.totalTests.includes('Sắp') ? 'Sắp ra mắt' : 'Bắt đầu luyện tập'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default PracticeAreas;
