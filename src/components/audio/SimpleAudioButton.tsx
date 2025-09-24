import React from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Pause, VolumeUp } from '@mui/icons-material';
import { useSimpleAudio } from '@/hooks';

interface SimpleAudioButtonProps {
  audioUrl: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  disabled?: boolean;
}

/**
 * Component button đơn giản để phát audio
 * Sử dụng useSimpleAudio hook cho các trường hợp cơ bản
 */
function SimpleAudioButton({
  audioUrl,
  color = '#1976d2',
  size = 'medium',
  tooltip = 'Phát audio',
  disabled = false,
}: SimpleAudioButtonProps) {
  const { audioState, audioControls } = useSimpleAudio(audioUrl);

  const handleClick = () => {
    if (disabled) return;
    if (audioState.isPlaying) {
      audioControls.pause();
    } else {
      audioControls.play();
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 56;
      default:
        return 40;
    }
  };

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={handleClick}
        disabled={disabled || audioState.isLoading || !!audioState.error}
        sx={{
          backgroundColor: color,
          color: 'white',
          width: getButtonSize(),
          height: getButtonSize(),
          '&:hover': {
            backgroundColor: color + 'dd',
          },
          '&:disabled': {
            backgroundColor: 'grey.300',
            color: 'grey.500',
          },
        }}
      >
        {audioState.isLoading ? (
          <CircularProgress size={getIconSize()} color="inherit" />
        ) : audioState.isPlaying ? (
          <Pause sx={{ fontSize: getIconSize() }} />
        ) : (
          <VolumeUp sx={{ fontSize: getIconSize() }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default SimpleAudioButton;
