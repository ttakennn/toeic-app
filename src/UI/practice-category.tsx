import { PracticeCategory as IPracticeCategory } from '@/types/core.interface';
import { Part1Util } from '@/utils/part1.util';
import { Quiz } from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CardActions,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface PracticeCategoryProps {
  item: IPracticeCategory;
  selectedPracticeTests: { [key: string]: number };
  handlePracticeTestChange: (id: string, testId: number) => void;
  handleStartTest: (id: string, testId: number) => void;
}

function PracticeCategory({
  item,
  selectedPracticeTests,
  handlePracticeTestChange,
  handleStartTest,
}: PracticeCategoryProps) {
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
          '& .practice-icon': {
            transform: 'scale(1.1)',
          },
        },
        border: `2px solid ${item.color}40`,
        backgroundColor: item.bgColor + '20',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            className="practice-icon"
            sx={{
              mr: 2,
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <Box
              component="img"
              src={item.icon}
              alt={item.title}
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: item.color,
              flex: 1,
            }}
          >
            {item.title}
          </Typography>
          <Chip
            label={`${item.totalTests} TEST`}
            size="small"
            sx={{
              backgroundColor: item.color + '20',
              color: item.color,
              fontWeight: 'medium',
            }}
          />
        </Box>

        <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.5, fontSize: '14px' }}>
          {item.description}
        </Typography>

        {/* Test Selector */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel
              sx={{
                color: item.color,
                '&.Mui-focused': { color: item.color },
              }}
            >
              Chọn đề TEST
            </InputLabel>
            <Select
              value={selectedPracticeTests[item.id]}
              onChange={(e) => handlePracticeTestChange(item.id, e.target.value as number)}
              label="Chọn đề TEST"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: item.color + '40',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: item.color + '60',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: item.color,
                },
                '& .MuiSelect-select': {
                  color: item.color,
                  fontWeight: 'medium',
                },
              }}
            >
              {item.tests.map((test) => (
                <MenuItem key={test.id} value={test.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Quiz sx={{ mr: 1, fontSize: 18, color: item.color }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {test.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip
                          label={test.difficulty}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '10px',
                            backgroundColor: Part1Util.getDifficultyColor(test.difficulty) + '20',
                            color: Part1Util.getDifficultyColor(test.difficulty),
                          }}
                        />
                        <Chip
                          label={`${test.questions} câu`}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '10px',
                            backgroundColor: item.color + '20',
                            color: item.color,
                          }}
                        />
                        <Chip
                          label={test.duration}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '10px',
                            backgroundColor: '#e0e0e0',
                            color: '#666',
                          }}
                        />
                      </Stack>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected Test Info */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: item.bgColor, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: item.color, mb: 1 }}>
              📋 {item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.difficulty}
                size="small"
                sx={{
                  backgroundColor:
                    Part1Util.getDifficultyColor(
                      item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.difficulty || 'Dễ',
                    ) + '20',
                  color: Part1Util.getDifficultyColor(
                    item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.difficulty || 'Dễ',
                  ),
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={`${item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.questions} câu hỏi`}
                size="small"
                sx={{
                  backgroundColor: item.color + '20',
                  color: item.color,
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.duration}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: item.color,
                  color: item.color,
                  fontWeight: 'medium',
                }}
              />
            </Stack>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => handleStartTest(item.id, selectedPracticeTests[item.id] || 1)}
          disabled={!item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.available}
          sx={{
            backgroundColor: item.color,
            fontWeight: 'medium',
            '&:hover': {
              backgroundColor: `${item.color}dd`,
            },
            '&.Mui-disabled': {
              backgroundColor: '#e0e0e0',
              color: '#999',
            },
          }}
        >
          {item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.available
            ? `🚀 Bắt đầu ${item.tests.find((test) => test.id === selectedPracticeTests[item.id])?.title}`
            : '⚠️ Chưa có sẵn'}
        </Button>
      </CardActions>
    </Card>
  );
}

export default PracticeCategory;
