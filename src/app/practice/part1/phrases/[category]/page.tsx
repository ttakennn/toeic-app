'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton,
  Collapse,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Tooltip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import { 
  Pause,
  Translate,
  ArrowBack,
  NavigateBefore,
  NavigateNext,
  VolumeUp,
  VolumeOff,
  Repeat,
  BookmarkBorder,
  Bookmark,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

interface PhraseData {
  id: number;
  image: string;
  audio: string;
  english: string;
  vietnamese: string;
  phonetic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface CategoryData {
  title: string;
  description: string;
  data: PhraseData[];
  totalItems: number;
}

interface ApiResponse {
  success: boolean;
  category: string;
  title: string;
  description: string;
  data: PhraseData[];
  totalItems: number;
  timestamp: string;
}


export default function PhraseCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = params.category as string;

  // Fetch data from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/part1/phrases/${category}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }
        
        const data: ApiResponse = await response.json();
        setCategoryData({
          title: data.title,
          description: data.description,
          data: data.data,
          totalItems: data.totalItems
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          {/* Header Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" width={150} height={36} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4, mb: 2 }} />
          </Box>

          {/* Main Card Skeleton */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 4, mb: 4 }} />
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 4 }} />
                <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 20 }} />
                  <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 20 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Loading indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mr: 2 }} />
            <Typography variant="h6" color="primary.main">
              Đang tải dữ liệu...
            </Typography>
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', py: 8 }}>
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ 
              mb: 4,
              '& .MuiAlert-message': {
                fontSize: '1.1rem'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              😔 Không thể tải dữ liệu
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
          </Alert>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              startIcon={<Repeat />}
            >
              Thử lại
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => router.push('/practice/part1')}
              startIcon={<ArrowBack />}
            >
              Quay lại Part 1
            </Button>
          </Stack>
        </Box>
      </DashboardLayout>
    );
  }

  // No data state
  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            😔 Không tìm thấy dữ liệu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Danh mục này chưa có dữ liệu hoặc đã bị xóa.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/practice/part1')}>
            Quay lại Part 1
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  const currentPhrase = categoryData.data[currentIndex];
  const progress = ((currentIndex + 1) / categoryData.data.length) * 100;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
      setShowPhonetic(false);
      setAudioProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < categoryData.data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      setShowPhonetic(false);
      setAudioProgress(0);
    }
  };

  const handlePlayAudio = () => {
    if (!currentPhrase.audio) {
      alert('Không có file âm thanh cho câu này');
      return;
    }

    if (!isPlaying) {
      // Create and play audio
      const audio = new Audio(currentPhrase.audio);
      setIsPlaying(true);
      setAudioProgress(0);

      // Handle audio events
      audio.onloadedmetadata = () => {
        const duration = audio.duration * 1000; // Convert to ms
        const interval = 100; // Update every 100ms
        const steps = duration / interval;
        let step = 0;
        
        const progressInterval = setInterval(() => {
          if (audio.paused || audio.ended) {
            clearInterval(progressInterval);
            setIsPlaying(false);
            setAudioProgress(0);
            return;
          }
          
          step++;
          const progress = (audio.currentTime / audio.duration) * 100;
          setAudioProgress(progress);
          
          if (step >= steps || audio.ended) {
            clearInterval(progressInterval);
            setIsPlaying(false);
            setAudioProgress(0);
          }
        }, interval);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setAudioProgress(0);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setAudioProgress(0);
        alert('Không thể phát audio. Vui lòng thử lại.');
      };

      // Set playback speed
      audio.playbackRate = playbackSpeed;
      
      // Play audio
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setAudioProgress(0);
        alert('Không thể phát audio. Vui lòng thử lại.');
      });
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentSpeedIndex = speeds.indexOf(playbackSpeed);
    const nextSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextSpeedIndex]);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const togglePhonetic = () => {
    setShowPhonetic(!showPhonetic);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleBack = () => {
    router.push('/practice/part1');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#757575';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ 
        maxWidth: 900, 
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 0 }
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Quay lại Part 1
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {categoryData.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {categoryData.description}
          </Typography>

          {/* Progress Info */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography variant="h6" sx={{ fontWeight: 500, textAlign: { xs: 'center', sm: 'left' } }}>
                Bài {currentIndex + 1} / {categoryData.data.length}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Chip 
                  label={getDifficultyLabel(currentPhrase.difficulty)}
                  size="small"
                  sx={{ 
                    backgroundColor: `${getDifficultyColor(currentPhrase.difficulty)}20`,
                    color: getDifficultyColor(currentPhrase.difficulty),
                    fontWeight: 'medium'
                  }}
                />
                <IconButton 
                  onClick={toggleBookmark}
                  sx={{ color: isBookmarked ? '#f57c00' : 'text.secondary' }}
                >
                  {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Stack>
            </Box>
            
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
                }
              }} 
            />
          </Box>
        </Box>

        {/* Main Content Card */}
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Image Section */}
            <Paper 
              elevation={3}
              sx={{ 
                width: '100%', 
                minHeight: { xs: 280, sm: 350 }, 
                backgroundColor: '#f8f9fa',
                borderRadius: 4,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
                border: `2px solid ${'primary.light'}20`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                },
                p: { xs: 2, sm: 3 }
              }}
            >
              {/* Enhanced placeholder for image */}
              <Box sx={{ 
                textAlign: 'center', 
                color: 'text.secondary',
                position: 'relative',
                zIndex: 2,
                width: '100%',
                mb: 3
              }}>
                {/* Better placeholder image */}
                <Box sx={{
                  width: { xs: 150, sm: 200 },
                  height: { xs: 100, sm: 150 },
                  mx: 'auto',
                  mb: 3,
                  borderRadius: 3,
                  backgroundColor: 'primary.main',
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  }
                }}>
                  <Box component="img" 
                    src={currentPhrase.image}
                    alt="TOEIC Learning"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                </Box>

                <Typography 
                  variant="h4" 
                  component="div" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 500, 
                    color: 'text.primary',
                    lineHeight: 1.4,
                    mb: 3,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    px: 1,
                    fontSize: { xs: '1.5rem', sm: '2.125rem' }
                  }}
                >
                  {currentPhrase.english}
                </Typography>
              </Box>

              {/* Control Buttons - Moved from below */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 2, width: '100%', px: 2 }}
              >
                <Button
                  variant={showPhonetic ? 'contained' : 'outlined'}
                  size="medium"
                  onClick={togglePhonetic}
                  startIcon={<VolumeOff />}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 150 },
                    borderRadius: 20,
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                >
                  {showPhonetic ? 'Ẩn phiên âm' : 'Hiện phiên âm'}
                </Button>

                <Button
                  variant={showTranslation ? 'contained' : 'outlined'}
                  onClick={toggleTranslation}
                  startIcon={<Translate />}
                  color="secondary"
                  size="medium"
                  sx={{ 
                    minWidth: { xs: '100%', sm: 150 },
                    borderRadius: 20,
                    fontWeight: 'medium',
                    py: 1.5
                  }}
                >
                  {showTranslation ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
                </Button>
              </Stack>

              {/* Phonetic Display */}
              <Collapse in={showPhonetic} sx={{ width: '100%', px: 2 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'grey.300'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1, fontSize: '12px', textAlign: 'center' }}
                  >
                    📢 Phiên âm IPA
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'primary.main', 
                      fontFamily: 'monospace',
                      fontStyle: 'normal',
                      textAlign: 'center',
                      fontSize: { xs: '16px', sm: '18px' },
                      fontWeight: 'medium'
                    }}
                  >
                    {currentPhrase.phonetic}
                  </Typography>
                </Paper>
              </Collapse>

              {/* Vietnamese Translation */}
              <Collapse in={showTranslation} sx={{ width: '100%', px: 2 }}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    backgroundColor: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'secondary.light',
                    position: 'relative'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="secondary.main" 
                    sx={{ mb: 1, fontSize: '12px', textAlign: 'center', fontWeight: 'medium' }}
                  >
                    🇻🇳 Bản dịch tiếng Việt
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 500,
                      fontStyle: 'italic',
                      textAlign: 'center',
                      lineHeight: 1.4,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    {currentPhrase.vietnamese}
                  </Typography>
                </Paper>
              </Collapse>

              {/* Enhanced tags overlay */}
              <Box sx={{ 
                position: 'absolute',
                top: 16,
                left: 16,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                zIndex: 3
              }}>
                {currentPhrase.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      color: 'primary.main',
                      fontSize: '11px',
                      fontWeight: 'medium',
                      border: '1px solid',
                      borderColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                zIndex: 1
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -15,
                left: -15,
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                zIndex: 1
              }} />
            </Paper>

            {/* Audio and Text Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Enhanced Audio Controls */}
              <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                  🎵 Audio Controls
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: { xs: 2, sm: 3 }, 
                  mb: 3,
                  flexWrap: 'wrap'
                }}>
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
                        '&::after': isPlaying ? {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          border: '2px solid',
                          borderColor: 'secondary.main',
                          borderRadius: '50%',
                          animation: 'pulse 1.5s infinite',
                        } : {}
                      }}
                    >
                      {isPlaying ? <Pause sx={{ fontSize: { xs: 28, sm: 32 } }} /> : <VolumeUp sx={{ fontSize: { xs: 28, sm: 32 } }} />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Lặp lại" arrow>
                    <IconButton 
                      onClick={handlePlayAudio}
                      sx={{ 
                        backgroundColor: 'grey.100',
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                          transform: 'rotate(360deg)',
                        },
                        transition: 'all 0.5s ease-in-out'
                      }}
                    >
                      <Repeat sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={`Tốc độ: ${playbackSpeed}x`} arrow>
                    <Button
                      variant="outlined"
                      onClick={handleSpeedChange}
                      size="small"
                      sx={{ 
                        minWidth: { xs: 50, sm: 60 },
                        borderRadius: 20,
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {playbackSpeed}x
                    </Button>
                  </Tooltip>
                </Box>

                {/* Enhanced Audio Progress */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                    {isPlaying ? '🎵 Đang phát...' : '⏸️ Nhấn play để nghe'}
                  </Typography>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={isPlaying ? audioProgress : 0} 
                    sx={{ 
                      width: '100%',
                      maxWidth: 300, 
                      mx: 'auto', 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      display: 'block',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'primary.main',
                        borderRadius: 3,
                        transition: 'width 0.1s linear',
                      }
                    }} 
                  />
                </Box>

                {/* Audio Quality Info */}
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Chip label="HD Audio" size="small" color="primary" variant="outlined" />
                  <Chip label="Native Speaker" size="small" color="secondary" variant="outlined" />
                </Stack>
              </Paper>

            </Box>
          </CardContent>
        </Card>

        {/* Enhanced Navigation Controls */}
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
            🧭 Điều hướng
          </Typography>
          
          {/* Mobile Navigation - Stack all buttons vertically */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2, mb: 3 }}>
            <Button
              variant={currentIndex === 0 ? 'outlined' : 'contained'}
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="large"
              fullWidth
              sx={{ 
                borderRadius: 25,
                fontWeight: 'medium'
              }}
            >
              Trước
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleBack}
                size="large"
                color="secondary"
                sx={{ 
                  borderRadius: 25,
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                🏠 Quay lại
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentIndex(Math.floor(Math.random() * categoryData.data.length));
                  setShowTranslation(false);
                  setShowPhonetic(false);
                }}
                size="large"
                sx={{ 
                  borderRadius: 25,
                  fontWeight: 'medium',
                  flex: 1
                }}
              >
                🎲 Ngẫu nhiên
              </Button>
            </Stack>

            <Button
              variant={currentIndex === categoryData.data.length - 1 ? 'outlined' : 'contained'}
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={currentIndex === categoryData.data.length - 1}
              size="large"
              fullWidth
              sx={{ 
                borderRadius: 25,
                fontWeight: 'medium'
              }}
            >
              Tiếp theo
            </Button>
          </Box>

          {/* Desktop Navigation - Original layout */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant={currentIndex === 0 ? 'outlined' : 'contained'}
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 25,
                fontWeight: 'medium'
              }}
            >
              Trước
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleBack}
                size="large"
                color="secondary"
                sx={{ 
                  borderRadius: 25,
                  fontWeight: 'bold',
                  minWidth: 120
                }}
              >
                🏠 Quay lại
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentIndex(Math.floor(Math.random() * categoryData.data.length));
                  setShowTranslation(false);
                  setShowPhonetic(false);
                }}
                size="large"
                sx={{ 
                  borderRadius: 25,
                  fontWeight: 'medium',
                  minWidth: 120
                }}
              >
                🎲 Ngẫu nhiên
              </Button>
            </Stack>

            <Button
              variant={currentIndex === categoryData.data.length - 1 ? 'outlined' : 'contained'}
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={currentIndex === categoryData.data.length - 1}
              size="large"
              sx={{ 
                minWidth: 140,
                borderRadius: 25,
                fontWeight: 'medium'
              }}
            >
              Tiếp theo
            </Button>
          </Box>

          {/* Progress Info */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Bài học {currentIndex + 1} / {categoryData.data.length}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip 
                label={`Còn lại: ${categoryData.data.length - currentIndex - 1}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`Hoàn thành: ${Math.round(((currentIndex + 1) / categoryData.data.length) * 100)}%`} 
                size="small" 
                color="success" 
                variant="filled" 
              />
            </Stack>
          </Box>
        </Paper>

        {/* Progress Dots */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {categoryData.data.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: index === currentIndex ? 'primary.dark' : 'grey.400',
                    transform: 'scale(1.2)',
                  },
                }}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowTranslation(false);
                  setShowPhonetic(false);
                  setAudioProgress(0);
                }}
              />
            ))}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Click vào chấm tròn để chuyển bài nhanh
          </Typography>
        </Box>

        {/* Enhanced Study Tips */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            background: 'linear-gradient(135deg, #fff3e0 0%, #fafafa 100%)',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'warning.light',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative element */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
          }} />

          <Typography variant="h5" gutterBottom sx={{ 
            color: 'warning.dark', 
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            💡 Mẹo học hiệu quả
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>1</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    <strong>Nghe nhiều lần:</strong> Phát âm ít nhất 3-5 lần để ghi nhớ cách đọc và ngữ điệu
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>2</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    <strong>Tốc độ dần:</strong> Bắt đầu với 0.5x rồi tăng dần lên 1.5x để quen với tempo thi thật
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>3</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    <strong>Từ khóa:</strong> Chú ý các động từ và danh từ chính để nhanh chóng nhận diện
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>4</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    <strong>Bookmark:</strong> Lưu lại những câu khó để ôn tập lại sau
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: 'warning.light' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              🎯 <strong>Mục tiêu:</strong> Nghe hiểu 100% câu trước khi chuyển sang bài tiếp theo
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1} 
              justifyContent="center"
              sx={{ alignItems: 'center' }}
            >
              <Chip label="Luyện tập đều đặn" size="small" color="success" variant="outlined" />
              <Chip label="Kiên trì là chìa khóa" size="small" color="primary" variant="outlined" />
              <Chip label="Tự tin vào bản thân" size="small" color="secondary" variant="outlined" />
            </Stack>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
