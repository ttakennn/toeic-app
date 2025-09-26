import { Box, Stack, Button, Link } from '@mui/material';
import { Home, TrendingUp, Refresh } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

interface FixedNavigationMobileResultProps {
  color: string;
  reworkHref: string;
  reviewHref: string;
}
function FixedNavigationMobileResult({ color, reworkHref, reviewHref }: FixedNavigationMobileResultProps) {
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
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Button
          size="medium"
          variant="contained"
          startIcon={<Refresh />}
          component={Link}
          href={reworkHref}
          sx={{
            flex: 1,
            backgroundColor: color,
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: color + 'dd',
            },
          }}
        >
          Làm lại bài test
        </Button>
        <Button
          size="medium"
          variant="outlined"
          startIcon={<TrendingUp />}
          component={Link}
          href={reviewHref}
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
          Chọn bài test khác
        </Button>

        <Button
          size="medium"
          variant="contained"
          endIcon={<Home />}
          component={Link}
          href="/"
          sx={{
            backgroundColor: color,
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: color + 'dd',
            },
          }}
        >
          Trang chủ
        </Button>
      </Stack>
    </Box>
  );
}

export default FixedNavigationMobileResult;
