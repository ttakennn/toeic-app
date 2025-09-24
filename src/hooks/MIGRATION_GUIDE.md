# Migration Guide: Chuyển đổi sang Audio Hooks

Hướng dẫn chuyển đổi từ code audio cũ sang sử dụng custom hooks mới.

## 1. Thay thế logic audio trong Test Pages

### Trước (Part 1 Test Page):

```typescript
// State cũ
const [isPlaying, setIsPlaying] = useState(false);
const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const audioLoadingRef = useRef(false);
const hasUserInteractedRef = useRef(false);

// Logic cũ (50+ lines)
const handlePlayAudio = useCallback(async () => {
  hasUserInteractedRef.current = true;
  const currentQuestionData = testData?.questions.find((q) => q.id === currentQuestion);
  if (!currentQuestionData?.audioUrl || audioLoadingRef.current) return;

  try {
    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
      return;
    }

    audioLoadingRef.current = true;
    // ... 40+ lines of audio logic
  } finally {
    audioLoadingRef.current = false;
  }
}, [testData, currentQuestion, isPlaying, audioElement]);
```

### Sau (với useAudio hook):

```typescript
import { useAudio } from '@/hooks';

// Thay thế tất cả state và logic bằng hook
const { audioState, audioControls, loadAudio } = useAudio(currentQuestionData?.audioUrl, {
  autoPlay: false,
  onEnded: () => console.log('Audio ended'),
  onError: (error) => console.error('Audio error:', error),
});

// Logic đơn giản hơn nhiều
const handlePlayAudio = useCallback(() => {
  audioControls.play();
}, [audioControls]);

// Load audio khi question thay đổi
useEffect(() => {
  if (currentQuestionData?.audioUrl) {
    loadAudio(currentQuestionData.audioUrl);
  }
}, [currentQuestionData?.audioUrl, loadAudio]);
```

## 2. Thay thế AudioControl Component

### Trước:

```typescript
<AudioControl
  color={categoryData.color}
  isPlaying={isPlaying}
  currentTime={currentTime}
  duration={duration}
  handlePlayAudio={handlePlayAudio}
  handleSeek={handleSeek}
  setCurrentTime={setCurrentTime}
/>
```

### Sau:

```typescript
<AudioControl
  color={categoryData.color}
  isPlaying={audioState.isPlaying}
  currentTime={audioState.currentTime}
  duration={audioState.duration}
  handlePlayAudio={audioControls.play}
  handleSeek={audioControls.seek}
  setCurrentTime={(time) => {}} // Không cần thiết nữa
/>
```

## 3. Thay thế Phrase Audio Component

### Trước (PhraseAudio component):

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [playbackSpeed, setPlaybackSpeed] = useState(1);

const handlePlayAudio = () => {
  // Logic phức tạp...
};
```

### Sau:

```typescript
import { useAudio } from '@/hooks';

const { audioState, audioControls } = useAudio(currentPhrase?.audioUrl, {
  playbackRate: playbackSpeed,
  onEnded: () => console.log('Phrase ended'),
});

const handlePlayAudio = () => {
  audioControls.play();
};

const handleSpeedChange = () => {
  const newSpeed = playbackSpeed === 1 ? 0.75 : playbackSpeed === 0.75 ? 0.5 : 1;
  setPlaybackSpeed(newSpeed);
  audioControls.setPlaybackRate(newSpeed);
};
```

## 4. Migration Steps

### Bước 1: Cài đặt hooks

```bash
# Hooks đã được tạo trong src/hooks/
# Import vào component cần sử dụng
import { useAudio, useSimpleAudio } from '@/hooks';
```

### Bước 2: Thay thế state

```typescript
// Xóa các state cũ
// const [isPlaying, setIsPlaying] = useState(false);
// const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
// const [currentTime, setCurrentTime] = useState(0);
// const [duration, setDuration] = useState(0);

// Thay bằng hook
const { audioState, audioControls } = useAudio(audioUrl);
```

### Bước 3: Thay thế logic

```typescript
// Xóa handlePlayAudio function phức tạp
// Thay bằng
const handlePlayAudio = () => {
  audioControls.play();
};
```

### Bước 4: Cập nhật JSX

```typescript
// Thay đổi props trong components
<AudioControl
  isPlaying={audioState.isPlaying}
  currentTime={audioState.currentTime}
  duration={audioState.duration}
  handlePlayAudio={audioControls.play}
  handleSeek={audioControls.seek}
/>
```

## 5. Lợi ích sau khi migration

### ✅ Code ngắn gọn hơn
- Giảm từ 50+ lines xuống 5-10 lines
- Loại bỏ duplicate logic

### ✅ Dễ maintain
- Logic audio tập trung trong hooks
- Dễ test và debug

### ✅ Tái sử dụng
- Có thể dùng hooks ở nhiều component khác nhau
- Consistent behavior

### ✅ Type safety
- Full TypeScript support
- IntelliSense và autocomplete

### ✅ Error handling
- Tự động xử lý lỗi
- Loading states

## 6. Testing

Sau khi migration, test các tính năng:

- [ ] Play/Pause audio
- [ ] Seek controls
- [ ] Volume control
- [ ] Playback speed
- [ ] Auto-play (nếu có)
- [ ] Error handling
- [ ] Loading states
- [ ] Cleanup khi unmount

## 7. Rollback Plan

Nếu có vấn đề, có thể rollback bằng cách:

1. Revert changes trong component
2. Restore old audio logic
3. Debug và fix issues
4. Re-apply migration

## 8. Performance Notes

- Hooks sử dụng refs để tránh re-render
- Automatic cleanup khi component unmount
- Memory leak prevention
- Optimized event listeners
