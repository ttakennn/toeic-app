import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Stack,
  Chip
} from '@mui/material';
import { 
  School, 
  Quiz, 
  PlayArrow,
  TrendingUp,
  VolumeUp,
  QuestionAnswer,
  Assignment
} from '@mui/icons-material';
import Link from 'next/link';

export default function PracticePage() {
  const practiceAreas = [
    {
      title: 'Part 1 - Mô tả hình ảnh',
      description: 'Luyện tập kỹ năng nghe và mô tả hình ảnh với 4 lựa chọn',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/practice/part1',
      color: '#1976d2',
      bgColor: '#e3f2fd',
      totalTests: '20+ bài thi',
      difficulty: 'Cơ bản - Nâng cao'
    },
    {
      title: 'Part 2 - Hỏi đáp',
      description: 'Phát triển khả năng nghe và phản ứng nhanh với câu hỏi',
      icon: <QuestionAnswer sx={{ fontSize: 40 }} />,
      path: '/practice/part2',
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      totalTests: '15+ bài thi',
      difficulty: 'Trung bình - Khó'
    },
    {
      title: 'Part 3 - Hội thoại ngắn',
      description: 'Thực hành nghe hiểu hội thoại giữa 2-3 người',
      icon: <VolumeUp sx={{ fontSize: 40 }} />,
      path: '/practice/part3',
      color: '#388e3c',
      bgColor: '#e8f5e8',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Nâng cao'
    },
    {
      title: 'Part 4 - Bài nói chuyện ngắn',
      description: 'Luyện nghe các bài thuyết trình, quảng cáo, thông báo',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      path: '/practice/part4',
      color: '#f57c00',
      bgColor: '#fff3e0',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Nâng cao'
    },
    {
      title: 'Part 5 - Hoàn thành câu',
      description: 'Cải thiện ngữ pháp và từ vựng với bài tập điền từ',
      icon: <School sx={{ fontSize: 40 }} />,
      path: '/practice/part5',
      color: '#d32f2f',
      bgColor: '#ffebee',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Trung bình'
    },
    {
      title: 'Part 6 - Hoàn thành đoạn văn',
      description: 'Thực hành đọc hiểu và hoàn thiện đoạn văn',
      icon: <Quiz sx={{ fontSize: 40 }} />,
      path: '/practice/part6',
      color: '#512da8',
      bgColor: '#ede7f6',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Khó'
    },
    {
      title: 'Part 7 - Đọc hiểu',
      description: 'Phát triển kỹ năng đọc hiểu với các đoạn văn dài',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      path: '/practice/part7',
      color: '#455a64',
      bgColor: '#eceff1',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Rất khó'
    }
  ];

  const stats = [
    { title: 'Tổng số bài thi', value: '150+', color: '#1976d2' },
    { title: 'Câu hỏi luyện tập', value: '5,000+', color: '#388e3c' },
    { title: 'Học viên', value: '10,000+', color: '#f57c00' },
    { title: 'Tỷ lệ cải thiện', value: '95%', color: '#7b1fa2' },
  ];

  return (
    <DashboardLayout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            🎯 Ôn luyện TOEIC
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Chọn phần bạn muốn luyện tập để cải thiện điểm số TOEIC của mình
          </Typography>
          
          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 6, sm: 3 }}>
                <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
                  <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Practice Areas */}
        <Grid container spacing={3}>
          {practiceAreas.map((area, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: area.bgColor
                  }}>
                    <Box sx={{ color: area.color, mr: 2 }}>
                      {area.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: area.color }}>
                      {area.title}
                    </Typography>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                    {area.description}
                  </Typography>

                  {/* Info */}
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={area.totalTests} 
                        size="small" 
                        sx={{ backgroundColor: area.bgColor, color: area.color }}
                      />
                      <Chip 
                        label={area.difficulty} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderColor: area.color, color: area.color }}
                      />
                    </Stack>
                  </Stack>

                  {/* Action Button */}
                  <Button
                    variant={area.totalTests.includes('Sắp') ? 'outlined' : 'contained'}
                    component={area.totalTests.includes('Sắp') ? 'button' : Link}
                    href={area.totalTests.includes('Sắp') ? undefined : area.path}
                    disabled={area.totalTests.includes('Sắp')}
                    fullWidth
                    sx={{
                      mt: 'auto',
                      py: 1.5,
                      backgroundColor: area.totalTests.includes('Sắp') ? 'transparent' : area.color,
                      borderColor: area.color,
                      color: area.totalTests.includes('Sắp') ? area.color : 'white',
                      '&:hover': {
                        backgroundColor: area.totalTests.includes('Sắp') ? area.bgColor : area.color + 'dd',
                      }
                    }}
                  >
                    {area.totalTests.includes('Sắp') ? 'Sắp ra mắt' : 'Bắt đầu luyện tập'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            🎓 Sẵn sàng nâng cao điểm TOEIC?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Hãy bắt đầu với Part 1 để làm quen với format bài thi và xây dựng nền tảng vững chắc
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/practice/part1"
            startIcon={<PlayArrow />}
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Bắt đầu với Part 1
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
