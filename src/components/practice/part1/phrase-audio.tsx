import { Box, Typography, Button, IconButton, Paper, Tooltip } from '@mui/material';
import { Pause, NavigateBefore, NavigateNext, VolumeUp, Repeat } from '@mui/icons-material';
import { PhrasesCategory } from '@/types/phrases.interface';

interface PhraseAudioProps {
  currentIndex: number;
  categoryData: PhrasesCategory;
  isPlaying: boolean;
  playbackSpeed: number;
  handlePrevious: () => void;
  handleNext: () => void;
  handlePlayAudio: () => void;
  handleSpeedChange: () => void;
}

function PhraseAudio({
  currentIndex,
  categoryData,
  isPlaying,
  playbackSpeed,
  handlePrevious,
  handleNext,
  handlePlayAudio,
  handleSpeedChange,
}: PhraseAudioProps) {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        {/* Enhanced Audio Controls */}
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
            🎵 Audio Controls
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
            }}
          >
            {/* Previous Button */}
            <Tooltip title="Bài trước" arrow>
              <IconButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{
                  backgroundColor: currentIndex === 0 ? 'grey.200' : 'primary.light',
                  color: currentIndex === 0 ? 'grey.500' : 'primary.main',
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  '&:hover': {
                    backgroundColor: currentIndex === 0 ? 'grey.200' : 'primary.main',
                    color: currentIndex === 0 ? 'grey.500' : 'white',
                    transform: currentIndex === 0 ? 'none' : 'scale(1.1)',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.200',
                    color: 'grey.500',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <NavigateBefore sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Lặp lại" arrow>
              <IconButton
                onClick={handlePlayAudio}
                sx={{
                  backgroundColor: 'grey.100',
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    transform: 'rotate(360deg)',
                  },
                  transition: 'all 0.5s ease-in-out',
                }}
              >
                <Repeat sx={{ fontSize: { xs: 16, sm: 18 } }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Phát âm" arrow>
              <IconButton
                onClick={handlePlayAudio}
                sx={{
                  backgroundColor: isPlaying ? 'secondary.main' : 'primary.main',
                  color: 'white',
                  width: { xs: 56, sm: 72 },
                  height: { xs: 56, sm: 72 },
                  border: '3px solid',
                  borderColor: isPlaying ? 'secondary.light' : 'primary.light',
                  '&:hover': {
                    backgroundColor: isPlaying ? 'secondary.dark' : 'primary.dark',
                    transform: 'scale(1.1)',
                    boxShadow: isPlaying ? 4 : 6,
                  },
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  '&::after': isPlaying
                    ? {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: '2px solid',
                        borderColor: 'secondary.main',
                        borderRadius: '50%',
                        animation: 'pulse 1.5s infinite',
                      }
                    : {},
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ fontSize: { xs: 28, sm: 32 } }} />
                ) : (
                  <VolumeUp sx={{ fontSize: { xs: 28, sm: 32 } }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={`Tốc độ: ${playbackSpeed}x`} arrow>
              <Button
                variant="outlined"
                onClick={handleSpeedChange}
                size="small"
                sx={{
                  minWidth: { xs: 45, sm: 50 },
                  height: { xs: 32, sm: 36 },
                  borderRadius: 20,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
              >
                {playbackSpeed}x
              </Button>
            </Tooltip>

            {/* Next Button */}
            <Tooltip title="Bài tiếp theo" arrow>
              <IconButton
                onClick={handleNext}
                disabled={currentIndex === categoryData.data.length - 1}
                sx={{
                  backgroundColor: currentIndex === categoryData.data.length - 1 ? 'grey.200' : 'primary.light',
                  color: currentIndex === categoryData.data.length - 1 ? 'grey.500' : 'primary.main',
                  width: { xs: 36, sm: 40 },
                  height: { xs: 36, sm: 40 },
                  '&:hover': {
                    backgroundColor: currentIndex === categoryData.data.length - 1 ? 'grey.200' : 'primary.main',
                    color: currentIndex === categoryData.data.length - 1 ? 'grey.500' : 'white',
                    transform: currentIndex === categoryData.data.length - 1 ? 'none' : 'scale(1.1)',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.200',
                    color: 'grey.500',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <NavigateNext sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Enhanced Audio Progress */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
              {isPlaying ? '🎵 Đang phát...' : '⏸️ Nhấn play để nghe'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default PhraseAudio;
