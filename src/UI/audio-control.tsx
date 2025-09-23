import { Box, Typography, Stack, IconButton, Slider } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { CommonUtil } from '@/utils/common.util';

interface AudioControlProps {
  color: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  handlePlayAudio: () => void;
  handleSeek: (newTime: number) => void;
  setCurrentTime: (time: number) => void;
}

function AudioControl({
  color,
  isPlaying,
  currentTime,
  duration,
  handlePlayAudio,
  handleSeek,
  setCurrentTime,
}: AudioControlProps) {
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
          <IconButton
            onClick={handlePlayAudio}
            sx={{
              backgroundColor: color,
              color: 'white',
              width: { xs: 30, md: 40 },
              height: { xs: 30, md: 40 },
              '&:hover': {
                backgroundColor: color + 'dd',
              },
            }}
          >
            {isPlaying ? (
              <Pause sx={{ fontSize: { xs: 24, md: 30 } }} />
            ) : (
              <PlayArrow sx={{ fontSize: { xs: 24, md: 30 } }} />
            )}
          </IconButton>

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: { xs: 68, md: 80 }, textAlign: 'center' }}>
            {CommonUtil.formatTime(Math.floor(currentTime || 0))} / {CommonUtil.formatTime(Math.floor(duration || 0))}
          </Typography>

          <Slider
            value={Math.min(currentTime, duration || 0)}
            min={0}
            max={duration || 0}
            step={0.1}
            onChange={(_, val) => {
              if (typeof val === 'number') setCurrentTime(val);
            }}
            onChangeCommitted={(_, val) => {
              if (typeof val === 'number') handleSeek(val);
            }}
            disabled={!duration}
            sx={{ color: color, flexGrow: 1, minWidth: 0 }}
          />
        </Stack>
      </Box>
    </>
  );
}

export default AudioControl;
