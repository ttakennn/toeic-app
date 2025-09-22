import { CardContent, Card, Grid, Box } from '@mui/material';

function PracticeItemSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <Grid size={{ xs: 12, md: 6 }} key={`practice-skeleton-${index}`}>
      <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#f0f0f0',
                borderRadius: 1,
                mr: 2,
              }}
            />
            <Box
              sx={{
                height: 24,
                width: '60%',
                backgroundColor: '#f0f0f0',
                borderRadius: 1,
                mr: 'auto',
              }}
            />
            <Box
              sx={{
                width: 60,
                height: 20,
                backgroundColor: '#f0f0f0',
                borderRadius: 1,
              }}
            />
          </Box>
          <Box
            sx={{
              height: 40,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
              mb: 3,
            }}
          />
          <Box
            sx={{
              height: 80,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
              mb: 3,
            }}
          />
          <Box
            sx={{
              height: 120,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  ));
}

export default PracticeItemSkeleton;
