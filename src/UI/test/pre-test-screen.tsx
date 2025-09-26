import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Card, CardContent, Grid, Button, Stack, Chip } from '@mui/material';
import { PlayArrow, Headphones } from '@mui/icons-material';
import { TestData } from '@/types/test.interface';
import { PracticeCategory } from '@/types/core.interface';
import { CommonUtil } from '@/utils/common.util';

interface PreTestScreenProps {
  category: string;
  categoryData: PracticeCategory;
  testData: TestData;
  handleStartTest: () => void;
}

function PreTestScreen({ category, categoryData, testData, handleStartTest }: PreTestScreenProps) {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: { xs: '100%', md: 900 }, mx: 'auto', p: { xs: 0, sm: 3 } }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4} alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ color: categoryData?.color }}>
                  {CommonUtil.getCategoryEmoji(category)} {testData.testInfo.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {categoryData.title}
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" sx={{ color: categoryData?.color, fontWeight: 'bold' }}>
                        {testData.testInfo.questions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Câu hỏi
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                        {testData.testInfo.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Chip
                        label={testData.testInfo.difficulty}
                        sx={{
                          backgroundColor: CommonUtil.getDifficultyColor(testData.testInfo.difficulty),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          px: 2,
                          py: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Độ khó
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 6, sm: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Headphones
                        sx={{
                          fontSize: {
                            xs: 30,
                            sm: 26,
                          },
                          color: 'primary.main',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Chỉ nghe
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                {testData.testInfo.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartTest}
                sx={{
                  backgroundColor: categoryData?.color,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: categoryData?.color + 'dd',
                  },
                }}
              >
                Bắt đầu làm bài
              </Button>

              {/* Hướng dẫn làm bài */}
              <Box sx={{ width: '100%', backgroundColor: '#e3f2fd', p: 2, borderRadius: 2 }}>
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {categoryData.guides?.title || '--'}
                </Typography>

                <Stack component="ul" spacing={0.5} sx={{ pl: 2, mt: 1 }}>
                  {categoryData.guides?.description.map((item) => (
                    <Typography
                      key={item.key}
                      component="li"
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: item.item }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default PreTestScreen;
