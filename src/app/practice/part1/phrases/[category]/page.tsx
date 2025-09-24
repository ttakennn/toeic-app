'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { PhrasesCategory } from '@/types/phrases.interface';
import PhraseTitle from '@/UI/phrase-title';
import { getPart1PhraseCategory } from '@/actions/part1/part1-phrase';
import PhraseCategoryDetailSkeleton from '@/components/practice/part1/phrase-category-detail-skeleton';
import PhraseCategoryDetailError from '@/components/practice/part1/phrase-category-detail-error';
// import PhraseProgress from '@/UI/phrase-progress';
import PhraseMainContent from '@/components/practice/part1/phrase-main-content';
import PhraseAudio from '@/components/practice/part1/phrase-audio';
import PhraseStudyTips from '@/components/practice/part1/phrase-study-tips';
import TopProgress from '@/UI/top-progress';

export default function PhraseCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [categoryData, setCategoryData] = useState<PhrasesCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = params.category as string;

  // Fetch data from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPart1PhraseCategory(category);
        setCategoryData({
          title: data.title,
          description: data.description,
          data: data.data,
          totalItems: data.totalItems,
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
    return <PhraseCategoryDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <PhraseCategoryDetailError
        error={error}
        backMessage="Quay lại Part 1"
        onGoBack={() => router.push('/practice/part1')}
      />
    );
  }

  // No data state
  if (!categoryData || !categoryData.data || categoryData.data.length === 0) {
    return (
      <PhraseCategoryDetailError
        error={error}
        backMessage="Quay lại Part 1"
        onGoBack={() => router.push('/practice/part1')}
      />
    );
  }

  const currentPhrase = categoryData.data[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowTranslation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < categoryData.data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
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
            return;
          }

          step++;

          if (step >= steps || audio.ended) {
            clearInterval(progressInterval);
            setIsPlaying(false);
          }
        }, interval);
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        alert('Không thể phát audio. Vui lòng thử lại.');
      };

      // Set playback speed
      audio.playbackRate = playbackSpeed;

      // Play audio
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
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

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleBack = () => {
    router.push('/practice/part1');
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 0, md: 0 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <PhraseTitle title={categoryData.title} description={categoryData.description} handleBack={handleBack} />
          {/* Progress Info */}
          {/* <PhraseProgress
            currentIndex={currentIndex}
            categoryData={categoryData}
            isBookmarked={isBookmarked}
            toggleBookmark={toggleBookmark}
            showBar={false}
          /> */}
        </Box>

        {/* Main Content Card */}
        <Box sx={{ mb: 3, overflow: 'visible', position: 'relative' }}>
          <TopProgress currentIndex={currentIndex + 1} lengthData={categoryData.data.length} />
          <Box sx={{ p: { xs: 0, sm: 0 } }}>
            {/* Image Section */}
            <PhraseMainContent
              categoryData={categoryData}
              currentIndex={currentIndex}
              showTranslation={showTranslation}
              isBookmarked={isBookmarked}
              toggleBookmark={toggleBookmark}
              toggleTranslation={toggleTranslation}
            />

            {/* Audio and Text Section */}
            <PhraseAudio
              currentIndex={currentIndex}
              categoryData={categoryData}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              handlePlayAudio={handlePlayAudio}
              handleSpeedChange={handleSpeedChange}
            />
          </Box>
        </Box>

        <PhraseStudyTips />
      </Box>
    </DashboardLayout>
  );
}
