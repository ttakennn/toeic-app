# Audio Hooks

Bộ custom hooks để quản lý audio playback trong TOEIC app.

## useAudio

Hook đầy đủ tính năng để quản lý audio với progress tracking, seek controls, và nhiều tùy chọn.

### Cách sử dụng:

```typescript
import { useAudio } from '@/hooks';

function MyComponent() {
  const { audioState, audioControls, loadAudio } = useAudio('https://example.com/audio.mp3', {
    autoPlay: false,
    loop: false,
    volume: 1,
    playbackRate: 1,
    onEnded: () => console.log('Audio ended'),
    onError: (error) => console.error('Audio error:', error),
  });

  return (
    <div>
      <button onClick={audioControls.play}>
        {audioState.isPlaying ? 'Pause' : 'Play'}
      </button>
      <div>Time: {audioState.currentTime} / {audioState.duration}</div>
      <input 
        type="range" 
        min="0" 
        max={audioState.duration}
        value={audioState.currentTime}
        onChange={(e) => audioControls.seek(Number(e.target.value))}
      />
    </div>
  );
}
```

### Props:

- `initialUrl?: string` - URL audio ban đầu
- `options?: UseAudioOptions` - Các tùy chọn cấu hình

### Options:

- `autoPlay?: boolean` - Tự động phát (mặc định: false)
- `loop?: boolean` - Lặp lại (mặc định: false)
- `volume?: number` - Âm lượng 0-1 (mặc định: 1)
- `playbackRate?: number` - Tốc độ phát 0.25-4 (mặc định: 1)
- `onEnded?: () => void` - Callback khi kết thúc
- `onError?: (error: Error) => void` - Callback khi có lỗi
- `onLoadStart?: () => void` - Callback khi bắt đầu load
- `onCanPlay?: () => void` - Callback khi có thể phát
- `onTimeUpdate?: (currentTime: number) => void` - Callback khi thời gian thay đổi
- `onDurationChange?: (duration: number) => void` - Callback khi duration thay đổi

### Return:

- `audioState: AudioState` - Trạng thái audio
- `audioControls: AudioControls` - Các controls
- `audioElement: HTMLAudioElement | null` - Audio element
- `loadAudio: (url: string) => void` - Function để load audio mới
- `isReady: boolean` - Audio đã sẵn sàng

## useSimpleAudio

Hook đơn giản cho các trường hợp sử dụng cơ bản, không cần progress tracking.

### Cách sử dụng:

```typescript
import { useSimpleAudio } from '@/hooks';

function MyComponent() {
  const { audioState, audioControls } = useSimpleAudio('https://example.com/audio.mp3');

  return (
    <button onClick={audioControls.play}>
      {audioState.isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}
```

### Props:

- `audioUrl?: string` - URL của audio file

### Return:

- `audioState: SimpleAudioState` - Trạng thái audio đơn giản
- `audioControls: SimpleAudioControls` - Các controls cơ bản
- `loadAudio: (url: string) => void` - Function để load audio mới

## Migration từ code cũ

### Trước (trong component):

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);

const handlePlayAudio = useCallback(async () => {
  // 50+ lines of audio logic...
}, []);
```

### Sau (với hook):

```typescript
const { audioState, audioControls } = useAudio(audioUrl, {
  onEnded: () => console.log('Audio ended'),
});

// Sử dụng
<button onClick={audioControls.play}>
  {audioState.isPlaying ? 'Pause' : 'Play'}
</button>
```

## Lưu ý

1. **User Interaction**: Browser yêu cầu user interaction trước khi có thể phát audio
2. **Error Handling**: Hook tự động xử lý các lỗi phổ biến
3. **Memory Management**: Hook tự động cleanup khi component unmount
4. **Performance**: Sử dụng refs để tránh re-render không cần thiết
