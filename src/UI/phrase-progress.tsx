import { Typography, Chip, Stack, Box, IconButton, LinearProgress } from '@mui/material';
import { PhrasesCategory } from '@/types/phrases.interface';
import { Part1Util } from '@/utils/part1.util';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';

interface PhraseProgressProps {
  currentIndex: number;
  categoryData: PhrasesCategory;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  showBar?: boolean;
}

function PhraseProgress({ currentIndex, categoryData, isBookmarked, toggleBookmark, showBar = true }: PhraseProgressProps) {
  const currentPhrase = categoryData.data[currentIndex];
  const progress = ((currentIndex + 1) / categoryData.data.length) * 100;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          flexDirection: { xs: 'row', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, textAlign: { xs: 'center', sm: 'left' } }}>
          Bài {currentIndex + 1} / {categoryData.data.length}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip
            label={`Hoàn thành: ${Math.round(((currentIndex + 1) / categoryData.data.length) * 100)}%`}
            size="small"
            color="success"
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
          <Chip
            label={currentPhrase.difficulty}
            size="small"
            sx={{
              backgroundColor: `${Part1Util.getDifficultyColor(currentPhrase.difficulty)}20`,
              color: Part1Util.getDifficultyColor(currentPhrase.difficulty),
              fontWeight: 'medium',
            }}
          />
          <IconButton onClick={toggleBookmark} sx={{ color: isBookmarked ? '#f57c00' : 'text.secondary' }}>
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Stack>
      </Box>

      {showBar && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#f0f0f0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #0d47a1, #1976d2)',
            },
          }}
        />
      )}
    </Box>
  );
}

export default PhraseProgress;
