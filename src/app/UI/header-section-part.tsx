import { PlayArrow, Star, Timer } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Box, Typography, Stack } from '@mui/material';
import { HeaderSectionPart as IHeaderSectionPart } from '../types/header-section-part.interface';

function HeaderSectionPart(headerSection: IHeaderSectionPart) {
  const { title, description, totalTests, partType, totalPoints } = headerSection;
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4, lineHeight: 1.6 }}>
        {description}
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 0,
          mt: 2, // Thêm margin-top cho Stack
          '& .MuiChip-root': {
            py: 2,
          },
        }}
      >
        <Chip icon={<Timer />} label={`${totalTests} câu hỏi`} color="primary" variant="outlined" />
        <Chip icon={<PlayArrow />} label={partType} color="secondary" variant="outlined" />
        <Chip icon={<Star />} label={`Điểm tối đa: ${totalPoints}`} color="primary" variant="filled" />
      </Stack>
    </Box>
  );
}

export default HeaderSectionPart;
