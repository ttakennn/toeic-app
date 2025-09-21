import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Typography, Grid } from '@mui/material';
import { School, Quiz, PlayArrow, TrendingUp, VolumeUp, QuestionAnswer, Assignment } from '@mui/icons-material';
import { PracticeData } from '../types/practice.interface';
import PracticeStats from '@/components/practice/practice-stats';
import PracticeAreas from '@/components/practice/practice-areas';
import PracticeBottomCta from '@/components/practice/practice-bottom-cta';

const practiceData: PracticeData = {
  title: 'Ôn luyện TOEIC',
  description: 'Chọn phần bạn muốn luyện tập để cải thiện điểm số TOEIC của mình',
  areas: [
    {
      title: 'Part 1 - Mô tả hình ảnh',
      description: 'Luyện tập kỹ năng nghe và mô tả hình ảnh với 4 lựa chọn',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      path: '/practice/part1',
      color: '#1976d2',
      bgColor: '#e3f2fd',
      totalTests: '20+ bài thi',
      difficulty: 'Cơ bản - Nâng cao',
    },
    {
      title: 'Part 2 - Hỏi đáp',
      description: 'Phát triển khả năng nghe và phản ứng nhanh với câu hỏi',
      icon: <QuestionAnswer sx={{ fontSize: 40 }} />,
      path: '/practice/part2',
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      totalTests: '15+ bài thi',
      difficulty: 'Trung bình - Khó',
    },
    {
      title: 'Part 3 - Hội thoại ngắn',
      description: 'Thực hành nghe hiểu hội thoại giữa 2-3 người',
      icon: <VolumeUp sx={{ fontSize: 40 }} />,
      path: '/practice/part3',
      color: '#388e3c',
      bgColor: '#e8f5e8',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Nâng cao',
    },
    {
      title: 'Part 4 - Bài nói chuyện ngắn',
      description: 'Luyện nghe các bài thuyết trình, quảng cáo, thông báo',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      path: '/practice/part4',
      color: '#f57c00',
      bgColor: '#fff3e0',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Nâng cao',
    },
    {
      title: 'Part 5 - Hoàn thành câu',
      description: 'Cải thiện ngữ pháp và từ vựng với bài tập điền từ',
      icon: <School sx={{ fontSize: 40 }} />,
      path: '/practice/part5',
      color: '#d32f2f',
      bgColor: '#ffebee',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Trung bình',
    },
    {
      title: 'Part 6 - Hoàn thành đoạn văn',
      description: 'Thực hành đọc hiểu và hoàn thiện đoạn văn',
      icon: <Quiz sx={{ fontSize: 40 }} />,
      path: '/practice/part6',
      color: '#512da8',
      bgColor: '#ede7f6',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Khó',
    },
    {
      title: 'Part 7 - Đọc hiểu',
      description: 'Phát triển kỹ năng đọc hiểu với các đoạn văn dài',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      path: '/practice/part7',
      color: '#455a64',
      bgColor: '#eceff1',
      totalTests: 'Sắp ra mắt',
      difficulty: 'Rất khó',
    },
  ],
  stats: [
    { title: 'Tổng số bài thi', value: '150+', color: '#1976d2' },
    { title: 'Câu hỏi luyện tập', value: '5,000+', color: '#388e3c' },
    { title: 'Học viên', value: '10,000+', color: '#f57c00' },
    { title: 'Tỷ lệ cải thiện', value: '95%', color: '#7b1fa2' },
  ],
};

export default function PracticePage() {
  return (
    <DashboardLayout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {practiceData.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {practiceData.description}
          </Typography>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {practiceData.stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 6, sm: 3 }}>
                <PracticeStats stat={stat} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Practice Areas */}
        <Grid container spacing={3}>
          {practiceData.areas.map((area, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <PracticeAreas area={area} />
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <PracticeBottomCta />
      </Box>
    </DashboardLayout>
  );
}
