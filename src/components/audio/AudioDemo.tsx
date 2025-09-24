import React, { useState } from 'react';
import { Box, Typography, Stack, Card, CardContent, Button, TextField, Alert } from '@mui/material';
import AudioPlayer from './AudioPlayer';
import SimpleAudioButton from './SimpleAudioButton';

/**
 * Demo component để test các audio hooks
 * Chỉ dùng cho development/testing
 */
function AudioDemo() {
  const [audioUrl, setAudioUrl] = useState('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
  const [customUrl, setCustomUrl] = useState('');

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(event.target.value);
  };

  const handleLoadCustomAudio = () => {
    if (customUrl.trim()) {
      setAudioUrl(customUrl);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Audio Hooks Demo
      </Typography>

      <Stack spacing={3}>
        {/* URL Input */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test với URL khác
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="Audio URL"
                value={customUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/audio.mp3"
                size="small"
              />
              <Button 
                variant="contained" 
                onClick={handleLoadCustomAudio}
                disabled={!customUrl.trim()}
              >
                Load
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Current URL: {audioUrl}
            </Typography>
          </CardContent>
        </Card>

        {/* Simple Audio Button Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              useSimpleAudio Hook Demo
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">Simple Audio Button:</Typography>
              <SimpleAudioButton 
                audioUrl={audioUrl}
                color="#4caf50"
                size="medium"
                tooltip="Phát audio đơn giản"
              />
              <SimpleAudioButton 
                audioUrl={audioUrl}
                color="#ff9800"
                size="small"
                tooltip="Button nhỏ"
              />
              <SimpleAudioButton 
                audioUrl={audioUrl}
                color="#9c27b0"
                size="large"
                tooltip="Button lớn"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Full Audio Player Demo */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              useAudio Hook Demo
            </Typography>
            <AudioPlayer
              audioUrl={audioUrl}
              title="Audio Player với đầy đủ controls"
              autoPlay={false}
              showControls={true}
              color="#1976d2"
              onEnded={() => console.log('Audio ended')}
              onError={(error) => console.error('Audio error:', error)}
            />
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cách sử dụng trong code
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>useSimpleAudio:</strong> Dùng cho các button phát audio đơn giản, không cần progress bar.
              </Typography>
            </Alert>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>useAudio:</strong> Dùng cho audio player đầy đủ tính năng với progress bar, seek controls, volume, speed.
              </Typography>
            </Alert>

            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto' }}>
{`// useSimpleAudio
import { useSimpleAudio } from '@/hooks';

const { audioState, audioControls } = useSimpleAudio(audioUrl);

<button onClick={audioControls.play}>
  {audioState.isPlaying ? 'Pause' : 'Play'}
</button>

// useAudio
import { useAudio } from '@/hooks';

const { audioState, audioControls } = useAudio(audioUrl, {
  autoPlay: false,
  onEnded: () => console.log('Ended'),
});

<button onClick={audioControls.play}>
  {audioState.isPlaying ? 'Pause' : 'Play'}
</button>
<input 
  type="range" 
  value={audioState.currentTime}
  max={audioState.duration}
  onChange={(e) => audioControls.seek(Number(e.target.value))}
/>`}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default AudioDemo;
