import React, { useCallback } from 'react';
import { Box, Typography, Stack, IconButton, Slider, Button, Popover } from '@mui/material';
import { PlayArrow, Pause, VolumeUp, VolumeOff } from '@mui/icons-material';
import { useAudio } from '@/hooks';
import { CommonUtil } from '@/utils/common.util';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  color?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  disabled?: boolean;
  showStatus?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Component Audio Player sử dụng useAudio hook
 * Demo cách sử dụng hook trong component thực tế
 */
function AudioPlayer({
  audioUrl,
  title = '',
  color = '#1976d2',
  autoPlay = false,
  showControls = true,
  disabled = false,
  showStatus = false,
  onEnded,
  onError,
}: AudioPlayerProps) {
  const { audioState, audioControls, audioElement, isReady } = useAudio(audioUrl, {
    autoPlay,
    onEnded,
    onError,
  });

  const [volumeAnchorEl, setVolumeAnchorEl] = React.useState<HTMLElement | null>(null);
  const isVolumeOpen = Boolean(volumeAnchorEl);

  const handleVolumeChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const volume = Array.isArray(newValue) ? newValue[0] : newValue;
      audioControls.setVolume(volume / 100);
    },
    [audioControls],
  );

  const handlePlaybackRateChange = useCallback(
    (rate: number) => {
      audioControls.setPlaybackRate(rate);
    },
    [audioControls],
  );

  const handleOpenVolume = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setVolumeAnchorEl(event.currentTarget);
    },
    [setVolumeAnchorEl],
  );

  const handleCloseVolume = useCallback(() => {
    setVolumeAnchorEl(null);
  }, [setVolumeAnchorEl]);

  if (!isReady && audioState.isLoading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Đang tải audio...
        </Typography>
      </Box>
    );
  }

  if (audioState.error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="error">
          Lỗi: {audioState.error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, color }}>
          {title}
        </Typography>
      )}

      {/* Main Controls */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
      >
        {/* Play Button */}
        <IconButton
          onClick={disabled ? undefined : audioControls.play}
          disabled={disabled}
          sx={{
            backgroundColor: color,
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: color + 'dd',
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500',
            },
          }}
        >
          {audioState.isPlaying ? <Pause sx={{ fontSize: 24 }} /> : <PlayArrow sx={{ fontSize: 24 }} />}
        </IconButton>
        {/* Stop Button */}
        {/* <IconButton onClick={audioControls.stop} disabled={!audioState.isPlaying}>
          <Stop />
        </IconButton> */}
        {/* Progress Bar */}
        <Slider
          value={Math.min(audioState.currentTime, audioState.duration || 0)}
          min={0}
          max={audioState.duration || 0}
          step={0.1}
          onChange={(_, val) => {
            if (disabled) return;
            if (typeof val === 'number') {
              audioControls.seek(val);
            }
          }}
          disabled={!audioState.duration || disabled}
          sx={{ color }}
        />
        {/* Time */}
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: { xs: 60, md: 60 } }}>
          {CommonUtil.formatTime(Math.floor(audioState.currentTime))} /{' '}
          {CommonUtil.formatTime(Math.floor(audioState.duration))}
        </Typography>
        {/* Volume Control - compact popover */}
        <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 2 }}>
          <IconButton onClick={disabled ? undefined : handleOpenVolume} size="small" disabled={disabled} sx={{ color }}>
            {(audioElement?.volume || 1) === 0 ? (
              <VolumeOff sx={{ fontSize: 20 }} />
            ) : (
              <VolumeUp sx={{ fontSize: 20 }} />
            )}
          </IconButton>
          {/* <Typography variant="caption" color="text.secondary">
            {Math.round((audioElement?.volume || 1) * 100)}%
          </Typography> */}
          <Popover
            open={isVolumeOpen && !disabled}
            anchorEl={volumeAnchorEl}
            onClose={handleCloseVolume}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            disableRestoreFocus
          >
            <Box sx={{ p: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <VolumeOff sx={{ fontSize: 18, color }} />
                <Slider
                  value={audioElement?.volume ? audioElement.volume * 100 : 100}
                  min={0}
                  max={100}
                  step={1}
                  onChange={disabled ? undefined : handleVolumeChange}
                  disabled={disabled}
                  sx={{ width: 100, color }}
                />
                <VolumeUp sx={{ fontSize: 18, color }} />
              </Stack>
            </Box>
          </Popover>
        </Stack>
      </Stack>

      {showControls && (
        <>
          {/* Playback Speed */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Tốc độ:
            </Typography>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <Button
                key={rate}
                size="small"
                variant={audioElement?.playbackRate === rate ? 'contained' : 'outlined'}
                onClick={disabled ? undefined : () => handlePlaybackRateChange(rate)}
                disabled={disabled}
                sx={{ minWidth: 40, fontSize: '0.75rem' }}
              >
                {rate}x
              </Button>
            ))}
          </Stack>
        </>
      )}

      {/* Status */}
      {showStatus && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {audioState.isPlaying ? '🎵 Đang phát...' : '⏸️ Tạm dừng'}
            {audioState.isLoading && ' (Đang tải...)'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AudioPlayer;
