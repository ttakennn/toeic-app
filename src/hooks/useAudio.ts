import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export interface AudioControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
}

export interface UseAudioOptions {
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  playbackRate?: number;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
}

export interface UseAudioReturn {
  audioState: AudioState;
  audioControls: AudioControls;
  audioElement: HTMLAudioElement | null;
  loadAudio: (url: string) => void;
  isReady: boolean;
}

/**
 * Custom hook để quản lý audio playback
 * @param initialUrl - URL audio ban đầu (optional)
 * @param options - Các tùy chọn cấu hình
 * @returns Object chứa state, controls và methods
 */
export function useAudio(initialUrl?: string, options: UseAudioOptions = {}): UseAudioReturn {
  const {
    autoPlay = false,
    loop = false,
    volume = 1,
    playbackRate = 1,
    onEnded,
    onError,
    onLoadStart,
    onCanPlay,
    onTimeUpdate,
    onDurationChange,
  } = options;

  // State
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  });

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLoadingRef = useRef(false);
  const hasUserInteractedRef = useRef(false);

  // Store callback functions in refs to avoid dependency issues
  const onEndedRef = useRef(onEnded);
  const onErrorRef = useRef(onError);
  const onLoadStartRef = useRef(onLoadStart);
  const onCanPlayRef = useRef(onCanPlay);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onDurationChangeRef = useRef(onDurationChange);

  // Update refs when callbacks change
  useEffect(() => {
    onEndedRef.current = onEnded;
    onErrorRef.current = onError;
    onLoadStartRef.current = onLoadStart;
    onCanPlayRef.current = onCanPlay;
    onTimeUpdateRef.current = onTimeUpdate;
    onDurationChangeRef.current = onDurationChange;
  }, [onEnded, onError, onLoadStart, onCanPlay, onTimeUpdate, onDurationChange]);

  // Store createAudioElement function in ref to avoid dependency issues
  const createAudioElementRef = useRef<((url: string) => HTMLAudioElement) | null>(null);
  const loadAudioRef = useRef<((url: string) => void) | null>(null);

  // Helper function để tạo audio element mới
  const createAudioElement = useCallback(
    (url: string): HTMLAudioElement => {
      const audio = new Audio(url);

      // Cấu hình cơ bản
      audio.loop = loop;
      audio.volume = volume;
      audio.playbackRate = playbackRate;

      // Event listeners
      audio.addEventListener('loadstart', () => {
        isLoadingRef.current = true;
        setAudioState((prev) => ({ ...prev, isLoading: true, error: null }));
        onLoadStartRef.current?.();
      });

      audio.addEventListener('canplay', () => {
        isLoadingRef.current = false;
        setAudioState((prev) => ({ ...prev, isLoading: false }));
        onCanPlayRef.current?.();
      });

      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration || 0;
        setAudioState((prev) => ({ ...prev, duration }));
        onDurationChangeRef.current?.(duration);
      });

      audio.addEventListener('durationchange', () => {
        const duration = audio.duration || 0;
        setAudioState((prev) => ({ ...prev, duration }));
        onDurationChangeRef.current?.(duration);
      });

      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime || 0;
        setAudioState((prev) => ({ ...prev, currentTime }));
        onTimeUpdateRef.current?.(currentTime);
      });

      audio.addEventListener('ended', () => {
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
        onEndedRef.current?.();
      });

      audio.addEventListener('error', (e) => {
        const error = new Error(`Audio playback error: ${e.type}`);
        isLoadingRef.current = false;
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: error.message,
        }));
        onErrorRef.current?.(error);
      });

      return audio;
    },
    [loop, volume, playbackRate],
  );

  // Update createAudioElement ref when function changes
  useEffect(() => {
    createAudioElementRef.current = createAudioElement;
  }, [createAudioElement]);

  // Load audio từ URL
  const loadAudio = useCallback((url: string) => {
    if (!url || url.trim() === '') {
      console.warn('Invalid audio URL provided');
      return;
    }

    // Cleanup audio hiện tại
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        // Remove all event listeners
        audioRef.current.removeEventListener('loadstart', () => {});
        audioRef.current.removeEventListener('canplay', () => {});
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('durationchange', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('error', () => {});
      } catch (error) {
        console.warn('Error cleaning up previous audio:', error);
      }
    }

      // Tạo audio element mới
      const newAudio = createAudioElementRef.current?.(url);
      if (newAudio) {
        audioRef.current = newAudio;
      }

    // Reset state
    setAudioState((prev) => ({
      ...prev,
      currentTime: 0,
      duration: 0,
      error: null,
    }));
  }, []);

  // Update loadAudio ref when function changes
  useEffect(() => {
    loadAudioRef.current = loadAudio;
  }, [loadAudio]);

  // Play audio
  const play = useCallback(async () => {
    if (!audioRef.current || isLoadingRef.current) return;

    hasUserInteractedRef.current = true;

    try {
      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }

      await audioRef.current.play();
      setAudioState((prev) => ({ ...prev, isPlaying: true }));
    } catch (error: unknown) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to play audio:', error);
        setAudioState((prev) => ({
          ...prev,
          isPlaying: false,
          error: (error as Error).message,
        }));
      }
    }
  }, [audioState.isPlaying]);

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
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
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    } catch (error) {
      console.warn('Error stopping audio:', error);
    }
  }, []);

  // Seek to specific time
  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current || Number.isNaN(time)) return;

      const clamped = Math.max(0, Math.min(audioState.duration || 0, time));
      try {
        audioRef.current.currentTime = clamped;
        setAudioState((prev) => ({ ...prev, currentTime: clamped }));
      } catch (error) {
        console.warn('Error seeking audio:', error);
      }
    },
    [audioState.duration],
  );

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;

    const clamped = Math.max(0, Math.min(1, newVolume));
    try {
      audioRef.current.volume = clamped;
    } catch (error) {
      console.warn('Error setting volume:', error);
    }
  }, []);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;

    const clamped = Math.max(0.25, Math.min(4, rate));
    try {
      audioRef.current.playbackRate = clamped;
    } catch (error) {
      console.warn('Error setting playback rate:', error);
    }
  }, []);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && audioRef.current && !isLoadingRef.current) {
      const timer = setTimeout(async () => {
        try {
          await audioRef.current?.play();
          setAudioState((prev) => ({ ...prev, isPlaying: true }));
          hasUserInteractedRef.current = true; // Mark as interacted after successful auto-play
        } catch (error) {
          console.warn('Auto-play failed:', error);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  // Load initial URL
  useEffect(() => {
    if (initialUrl && loadAudioRef.current) {
      loadAudioRef.current(initialUrl);
    }
  }, [initialUrl]);

  // Auto-play when URL changes (for test page navigation)
  useEffect(() => {
    if (autoPlay && initialUrl && audioRef.current && !isLoadingRef.current) {
      const timer = setTimeout(async () => {
        try {
          // Wait for audio to be ready
          if (audioRef.current && audioRef.current.readyState >= 2) {
            await audioRef.current.play();
            setAudioState((prev) => ({ ...prev, isPlaying: true }));
            hasUserInteractedRef.current = true;
          } else {
            // If not ready, wait a bit more
            const retryTimer = setTimeout(async () => {
              if (audioRef.current && audioRef.current.readyState >= 2) {
                try {
                  await audioRef.current.play();
                  setAudioState((prev) => ({ ...prev, isPlaying: true }));
                  hasUserInteractedRef.current = true;
                } catch (error) {
                  console.warn('Auto-play retry failed:', error);
                }
              }
            }, 1000);
            return () => clearTimeout(retryTimer);
          }
        } catch (error) {
          console.warn('Auto-play on URL change failed:', error);
        }
      }, 800); // Slightly longer delay for URL changes

      return () => clearTimeout(timer);
    }
  }, [initialUrl, autoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
    };
  }, []);

  // Update volume and playback rate when they change
  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = volume;
        audioRef.current.playbackRate = playbackRate;
      } catch (error) {
        console.warn('Error updating audio properties:', error);
      }
    }
  }, [volume, playbackRate]);

  const audioControls: AudioControls = {
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
  };

  return {
    audioState,
    audioControls,
    audioElement: audioRef.current,
    isReady: !!audioRef.current && !audioState.isLoading && !audioState.error,
    loadAudio,
  };
}

export default useAudio;
