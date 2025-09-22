import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Grid } from '@mui/material';
import { School, Quiz, TrendingUp, CheckCircle, PlayArrow, Assessment } from '@mui/icons-material';
import { HomeData } from '../types/home.interface';
import HomeWelcome from '@/components/home/home-welcome';
import HomeStats from '@/components/home/home-stats';
import HomeQuick from '@/components/home/home-quick';
import HomeHighlight from '@/components/home/home-highlight';
import HomeActivity from '@/components/home/home-activity';

const homeData: HomeData = {
  welcome: {
    title: 'Chào mừng đến với Ken TOEIC! 👋',
    description:
      'Nền tảng học TOEIC toàn diện, giúp bạn chinh phục mục tiêu điểm số mong muốn. Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!',
  },
  stats: [
    { title: 'Tổng số bài học', value: '150+', icon: <School />, color: '#1976d2' },
    { title: 'Đề thi thử', value: '20+', icon: <Quiz />, color: '#388e3c' },
    { title: 'Học viên', value: '10,000+', icon: <CheckCircle />, color: '#f57c00' },
    { title: 'Tỷ lệ cải thiện', value: '95%', icon: <TrendingUp />, color: '#7b1fa2' },
  ],
  quickAccess: [
    {
      title: 'Ôn luyện Part 1',
      description: 'Bắt đầu với phần mô tả hình ảnh',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/practice/part1',
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Ôn luyện Part 2',
      description: 'Luyện tập câu hỏi hỏi đáp',
      icon: <Quiz sx={{ fontSize: 40 }} />,
      path: '/practice/part2',
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
    },
    {
      title: 'Thi thử TOEIC',
      description: 'Kiểm tra trình độ hiện tại',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/exam',
      color: '#388e3c',
      bgColor: '#e8f5e8',
    },
  ],
};

export default function Home() {
  return (
    <DashboardLayout>
      <Box>
        <HomeWelcome {...homeData.welcome} />
        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {homeData.stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <HomeStats stat={stat} />
            </Grid>
          ))}
        </Grid>
        {/* Quick Access */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            🚀 Truy cập nhanh
          </Typography>
          <Grid container spacing={3}>
            {homeData.quickAccess.map((quick, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <HomeQuick quick={quick} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <HomeHighlight />
        <HomeActivity />
      </Box>
    </DashboardLayout>
  );
}
