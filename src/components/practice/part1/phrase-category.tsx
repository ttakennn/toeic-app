import { Box, Typography, Card, CardContent, Button, CardActions, Chip, Stack } from '@mui/material';
import { Part1PhraseCategory as IPart1PhraseCategory } from '@/types/part1.interface';
import Link from 'next/link';

interface PhraseCategoryProps {
  category: IPart1PhraseCategory;
}

function Part1PhraseCategory({ category }: PhraseCategoryProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          '& .category-icon': {
            transform: 'scale(1.1)',
          },
        },
        border: `2px solid ${category.bgColor}`,
        backgroundColor: category.bgColor + '40',
      }}
    >
      {/* Progress indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: '#f0f0f0',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${category.progress}%`,
            backgroundColor: category.color,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
        <Box
          className="category-icon"
          sx={{
            mb: 2,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <Box
            component="img"
            src={category.icon}
            alt={category.title}
            sx={{
              width: 80,
              height: 80,
              objectFit: 'contain',
            }}
          />
        </Box>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            color: category.color,
            fontWeight: 600,
            mb: 2,
          }}
        >
          {category.title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: '14px',
            lineHeight: 1.5,
          }}
        >
          {category.description}
        </Typography>

        <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`${category.count} cụm từ`}
            size="small"
            sx={{
              backgroundColor: category.color + '20',
              color: category.color,
              fontWeight: 'medium',
            }}
          />
          <Chip label={`${category.progress}%`} size="small" color="success" variant="outlined" />
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          component={Link}
          href={`/practice/part1/phrases/${category.id}`}
          sx={{
            backgroundColor: category.color,
            fontWeight: 'medium',
            '&:hover': {
              backgroundColor: `${category.color}dd`,
            },
          }}
        >
          {category.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default Part1PhraseCategory;
