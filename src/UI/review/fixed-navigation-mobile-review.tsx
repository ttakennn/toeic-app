import { Box, Stack, Button } from '@mui/material';
import { ViewComfy, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface FixedNavigationMobileReviewProps {
  color: string;
  currentQuestion: number;
  testQuestionLength: number;
  linkToFinish: string;
  handleBackToResults: () => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
}
function FixedNavigationMobileReview({
  color,
  currentQuestion,
  testQuestionLength,
  linkToFinish,
  handleBackToResults,
  handlePrevQuestion,
  handleNextQuestion,
}: FixedNavigationMobileReviewProps) {
  const [showNavButtons, setShowNavButtons] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Clear existing timeout
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        // Only trigger if significant scroll difference
        const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
        if (scrollDiff > 5) {
          // Determine scroll direction
          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            // Scrolling down - hide buttons
            setShowNavButtons(false);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up - show buttons
            setShowNavButtons(true);
          }

          lastScrollY.current = currentScrollY;
        }

        // Auto show buttons after scroll stops
        scrollTimeout.current = setTimeout(() => {
          setShowNavButtons(true);
        }, 1500);

        isScrolling = false;
      });
    };

    // Always add scroll listener (responsive check inside)
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateScrollListener = () => {
      if (mediaQuery.matches) {
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Reset state when switching to mobile
        setShowNavButtons(true);
        lastScrollY.current = 0;
      } else {
        window.removeEventListener('scroll', handleScroll);
        // Always show on desktop
        setShowNavButtons(true);
      }
    };

    // Initial setup
    updateScrollListener();

    // Listen for viewport changes
    mediaQuery.addEventListener('change', updateScrollListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', updateScrollListener);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []); // Empty dependency array is correct here

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        p: 1.5,
        zIndex: 1000,
        transform: showNavButtons ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          size="medium"
          variant="contained"
          startIcon={<ViewComfy />}
          onClick={handleBackToResults}
          disabled={currentQuestion === 1}
          sx={{
            flex: 1,
            backgroundColor: color,
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: color + 'dd',
            },
          }}
        >
          Xem kết quả
        </Button>
        <Button
          size="medium"
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 1}
          sx={{
            flex: 1,
            color: color,
            borderColor: color,
            fontSize: '0.9rem',
            '&:disabled': {
              opacity: 0.5,
              borderColor: '#ccc',
              color: '#ccc',
            },
          }}
        >
          Câu trước
        </Button>

        {currentQuestion === testQuestionLength ? (
          <Button
            size="medium"
            variant="contained"
            component={Link}
            href={linkToFinish}
            sx={{
              flex: 1,
              backgroundColor: color,
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: color + 'dd',
              },
            }}
          >
            Hoàn thành
          </Button>
        ) : (
          <Button
            size="medium"
            variant="contained"
            endIcon={<NavigateNext />}
            onClick={handleNextQuestion}
            sx={{
              flex: 1,
              backgroundColor: color,
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: color + 'dd',
              },
            }}
          >
            Câu tiếp
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default FixedNavigationMobileReview;
