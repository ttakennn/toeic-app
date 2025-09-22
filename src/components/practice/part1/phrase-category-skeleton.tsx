import { CardContent, Card, Grid, Box } from '@mui/material';

function PhraseCategorySkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${index}`}>
      <Card sx={{ height: 320, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
              mx: 'auto',
              mb: 2,
            }}
          />
          <Box
            sx={{
              height: 24,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
              mb: 1,
            }}
          />
          <Box
            sx={{
              height: 40,
              backgroundColor: '#f0f0f0',
              borderRadius: 1,
              mb: 2,
            }}
          />
        </CardContent>
      </Card>
    </Grid>
  ));
}

export default PhraseCategorySkeleton;
