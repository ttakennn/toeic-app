import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Container,
  Chip,
  Stack
} from '@mui/material';
import { 
  School, 
  Quiz, 
  TrendingUp, 
  CheckCircle,
  PlayArrow,
  Assessment
} from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  const stats = [
    { title: 'Tổng số bài học', value: '150+', icon: <School />, color: '#1976d2' },
    { title: 'Đề thi thử', value: '20+', icon: <Quiz />, color: '#388e3c' },
    { title: 'Học viên', value: '10,000+', icon: <CheckCircle />, color: '#f57c00' },
    { title: 'Tỷ lệ cải thiện', value: '95%', icon: <TrendingUp />, color: '#7b1fa2' },
  ];

  const quickAccess = [
    {
      title: 'Ôn luyện Part 1',
      description: 'Bắt đầu với phần mô tả hình ảnh',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/practice/part1',
      color: '#1976d2',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Ôn luyện Part 2',
      description: 'Luyện tập câu hỏi hỏi đáp',
      icon: <Quiz sx={{ fontSize: 40 }} />,
      path: '/practice/part2',
      color: '#7b1fa2',
      bgColor: '#f3e5f5'
    },
    {
      title: 'Thi thử TOEIC',
      description: 'Kiểm tra trình độ hiện tại',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/exam',
      color: '#388e3c',
      bgColor: '#e8f5e8'
    }
  ];

  return (
    <DashboardLayout>
      <Box>
        {/* Welcome Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Chào mừng đến với Ken TOEIC! 👋
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4, lineHeight: 1.6 }}>
            Nền tảng học TOEIC toàn diện, giúp bạn chinh phục mục tiêu điểm số mong muốn. 
            Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<PlayArrow />}
              component={Link}
              href="/practice/part1"
              sx={{ minWidth: 200 }}
            >
              Bắt đầu học ngay
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<Assessment />}
              component={Link}
              href="/exam"
              sx={{ minWidth: 200 }}
            >
              Làm bài thi thử
            </Button>
          </Stack>
        </Box>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                },
                border: `2px solid ${stat.color}20`,
                backgroundColor: `${stat.color}10`
              }}>
                <CardContent sx={{ pb: 2 }}>
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" component="div" sx={{ 
                    mb: 1, 
                    color: stat.color,
                    fontWeight: 'bold'
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Access */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ 
            mb: 3, 
            color: 'primary.main',
            fontWeight: 600 
          }}>
            🚀 Truy cập nhanh
          </Typography>
          
          <Grid container spacing={3}>
            {quickAccess.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card 
                  component={Link}
                  href={item.path}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: item.bgColor,
                    border: `2px solid ${item.color}20`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      '& .quick-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Box 
                      className="quick-icon"
                      sx={{ 
                        color: item.color, 
                        mb: 3,
                        transition: 'transform 0.3s ease-in-out'
                      }}
                    >
                      {item.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" gutterBottom sx={{ 
                      color: item.color,
                      fontWeight: 600,
                      mb: 2
                    }}>
                      {item.title}
                    </Typography>
                    
                    <Typography color="text.secondary" sx={{ 
                      fontSize: '16px',
                      lineHeight: 1.5
                    }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Feature Highlight */}
        <Card sx={{ 
          p: 4, 
          mb: 6, 
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              🎯 Tại sao chọn Ken TOEIC?
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Hệ thống học tập khoa học:</strong> Từ Part 1 đến Part 7, mỗi phần được thiết kế chi tiết
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Giao diện thân thiện:</strong> Dễ sử dụng trên mọi thiết bị
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Theo dõi tiến độ:</strong> Biết rõ bạn đã học được bao nhiều
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Audio chất lượng cao:</strong> Luyện nghe với giọng chuẩn
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Từ vựng theo chủ đề:</strong> Học hiệu quả hơn với phân loại rõ ràng
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, opacity: 0.95, lineHeight: 1.6 }}>
                  • <strong>Thi thử thực tế:</strong> Mô phỏng hoàn toàn kỳ thi TOEIC
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                component={Link}
                href="/practice/part1"
                sx={{ 
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  minWidth: 200,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Khám phá ngay! 🎉
              </Button>
            </Box>
          </Box>
          
          {/* Decorative elements */}
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }} />
        </Card>

        {/* Recent Activity - Placeholder for future */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            📚 Bạn đã sẵn sàng bắt đầu chưa?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Hãy chọn phần bạn muốn luyện tập từ sidebar bên trái, hoặc bắt đầu với Part 1 - 
            phần dễ nhất để làm quen với format thi TOEIC.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Chip 
              label="💪 Part 1: Dễ nhất để bắt đầu" 
              color="success" 
              variant="filled" 
              sx={{ fontSize: '14px', py: 2 }}
            />
            <Chip 
              label="🎯 6 câu hỏi - 10 phút" 
              color="primary" 
              variant="outlined" 
              sx={{ fontSize: '14px', py: 2 }}
            />
            <Chip 
              label="🔊 Luyện nghe mô tả hình ảnh" 
              color="secondary" 
              variant="outlined" 
              sx={{ fontSize: '14px', py: 2 }}
            />
          </Stack>
        </Card>
      </Box>
    </DashboardLayout>
  );
}