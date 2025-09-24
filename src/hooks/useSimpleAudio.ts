import { useState, useRef, useCallback } from 'react';

export interface SimpleAudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SimpleAudioControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
}

/**
 * Hook đơn giản để quản lý audio playback cơ bản
 * Phù hợp cho các trường hợp không cần progress bar hoặc seek controls
 * @param audioUrl - URL của audio file
 * @returns Object chứa state và controls
 */
export function useSimpleAudio(audioUrl?: string) {
  const [audioState, setAudioState] = useState<SimpleAudioState>({
    isPlaying: false,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingRef = useRef(false);

  // Load audio
  const loadAudio = useCallback((url: string) => {
    if (!url || url.trim() === '') {
      console.warn('Invalid audio URL provided');
      return;
    }

    // Cleanup previous audio
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.warn('Error cleaning up previous audio:', error);
      }
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    // Event listeners
    audio.addEventListener('loadstart', () => {
      isLoadingRef.current = true;
      setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
    });

    audio.addEventListener('canplay', () => {
      isLoadingRef.current = false;
      setAudioState(prev => ({ ...prev, isLoading: false }));
    });

    audio.addEventListener('ended', () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('error', (e) => {
      const error = new Error(`Audio playback error: ${e.type}`);
      isLoadingRef.current = false;
      setAudioState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false, 
        error: error.message 
      }));
    });
  }, []);

  // Play audio
  const play = useCallback(async () => {
    if (!audioRef.current || isLoadingRef.current) return;

    try {
      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
        return;
      }

      await audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    } catch (error: unknown) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to play audio:', error);
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          error: (error as Error).message 
        }));
      }
    }
  }, [audioState.isPlaying]);

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.warn('Error pausing audio:', error);
    }
  }, []);

  // Stop audio
  const stop = useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.warn('Error stopping audio:', error);
    }
  }, []);

  // Load initial URL
  if (audioUrl && !audioRef.current) {
    loadAudio(audioUrl);
  }

  const audioControls: SimpleAudioControls = {
    play,
    pause,
    stop,
  };

  return {
    audioState,
    audioControls,
    loadAudio,
  };
}

export default useSimpleAudio;
