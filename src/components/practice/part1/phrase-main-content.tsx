import { Box, Typography, IconButton, Chip } from '@mui/material';
import { BookmarkBorder, Bookmark, Translate } from '@mui/icons-material';
import { PhrasesCategory } from '@/types/phrases.interface';
// import { CommonUtil } from '@/utils/common.util';

interface PhraseMainContentProps {
  categoryData: PhrasesCategory;
  currentIndex: number;
  showTranslation: boolean;
  isBookmarked: boolean;
  toggleBookmark: () => void;
  toggleTranslation: () => void;
}

function PhraseMainContent({
  categoryData,
  currentIndex,
  showTranslation,
  isBookmarked,
  toggleBookmark,
  toggleTranslation,
}: PhraseMainContentProps) {
  const currentPhrase = categoryData.data[currentIndex];
  return (
    <>
      <Box
        sx={{
          backgroundColor: '#f8f9fa',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
          border: `2px solid ${'primary.light'}20`,
          pt: { xs: 2, sm: 2 },
        }}
      >
        {/* Enhanced placeholder for image */}
        <Box
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }}
        >
          {/* Better placeholder image */}
          <Box
            sx={{
              width: { xs: 150, sm: 200 },
              height: { xs: 100, sm: 150 },
              mx: 'auto',
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
              },
            }}
          >
            <Box
              component="img"
              src={currentPhrase.image}
              alt="TOEIC Learning"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: 1.4,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  fontSize: { xs: '1.5rem', sm: '2.125rem' },
                }}
              >
                {currentPhrase.english}
              </Typography>
              <Typography onClick={toggleTranslation} sx={{ ml: 1, cursor: 'pointer' }}>
                {showTranslation ? <Translate color="primary" /> : <Translate color="secondary" />}
              </Typography>
            </Box>
            <Box sx={{ minHeight: { xs: 28, sm: 28 } }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'secondary.main',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: { xs: '1rem', sm: '1rem' },
                  visibility: showTranslation ? 'visible' : 'hidden',
                }}
              >
                {currentPhrase.vietnamese}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 12 },
            left: { xs: 8, sm: 12 },
            zIndex: 3,
            color: 'primary.main',
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 0, sm: 1 },
            }}
          >
            <Box>
              {currentIndex + 1} / {categoryData.data.length}
            </Box>
            <Box>
              <IconButton
                onClick={toggleBookmark}
                aria-label="bookmark"
                sx={{ color: isBookmarked ? '#f57c00' : 'text.secondary' }}
              >
                {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>
          </Box>
        </Box>
        {/* Hình tròn bên phải */}
        {/* <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            zIndex: 1,
          }}
        /> */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 12 },
            right: { xs: 8, sm: 12 },
            zIndex: 3,
            color: 'primary.main',
            fontWeight: 500,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <Chip
            label={`${Math.round(((currentIndex + 1) / categoryData.data.length) * 100)}%`}
            size="small"
            color="success"
            variant="filled"
            sx={{ fontWeight: 'medium' }}
          />
          {/* <Chip
            label={currentPhrase.difficulty}
            size="small"
            sx={{
              backgroundColor: `${CommonUtil.getDifficultyColor(currentPhrase.difficulty)}20`,
              color: CommonUtil.getDifficultyColor(currentPhrase.difficulty),
              fontWeight: 'medium',
            }}
          /> */}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: -15,
            left: -15,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            zIndex: 1,
          }}
        />
      </Box>
    </>
  );
}

export default PhraseMainContent;
