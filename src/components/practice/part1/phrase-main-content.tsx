import { Box, Typography, Paper } from '@mui/material';
import { Translate } from '@mui/icons-material';
import { PhrasesCategory } from '@/types/phrases.interface';

interface PhraseMainContentProps {
  categoryData: PhrasesCategory;
  currentIndex: number;
  showTranslation: boolean;
  toggleTranslation: () => void;
}

function PhraseMainContent({ categoryData, currentIndex, showTranslation, toggleTranslation }: PhraseMainContentProps) {
  const currentPhrase = categoryData.data[currentIndex];
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          width: '100%',
          minHeight: { xs: 250, sm: 300 },
          backgroundColor: '#f8f9fa',
          borderRadius: 4,
          mb: 2,
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
            transform: 'scale(1.01)',
            boxShadow: 6,
          },
          p: { xs: 1, sm: 1 },
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
            mb: 1,
          }}
        >
          {/* Better placeholder image */}
          <Box
            sx={{
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
            {showTranslation && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 500,
                    fontStyle: 'italic',
                    textAlign: 'center',
                    fontSize: { xs: '1rem', sm: '1rem' },
                  }}
                >
                  {currentPhrase.vietnamese}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {/* Decorative elements */}
        <Box
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
        />
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
      </Paper>
    </>
  );
}

export default PhraseMainContent;
