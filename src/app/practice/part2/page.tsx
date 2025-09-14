import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Divider,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { 
  PlayArrow, 
  QuestionAnswer,
  Person,
  Place,
  Schedule,
  Build,
  Psychology,
  CheckCircle,
  QuestionMark,
  CompareArrows,
  RequestPage,
  ChatBubble,
  Timer,
  Star,
  TrendingUp,
  Category
} from '@mui/icons-material';
import Link from 'next/link';

export default function Part2Page() {
  const practiceItems = [
    {
      id: 'basic',
      title: 'Bài tập cơ bản',
      description: 'Luyện tập với các câu hỏi Part 2 từ dễ đến trung bình. Phù hợp cho người mới bắt đầu.',
      lessons: 20,
      duration: '25 phút',
      difficulty: 'Dễ',
      color: '#4caf50',
      completed: 12
    },
    {
      id: 'advanced',
      title: 'Bài tập nâng cao',
      description: 'Thử thách bản thân với các câu hỏi khó hơn. Nâng cao kỹ năng nghe hiểu và phản xạ.',
      lessons: 25,
      duration: '35 phút',
      difficulty: 'Khó',
      color: '#f44336',
      completed: 8
    },
    {
      id: 'simulation',
      title: 'Thi thử Part 2',
      description: 'Làm bài thi thử trong điều kiện thực tế với 25 câu hỏi như thi TOEIC thật.',
      lessons: 15,
      duration: '15 phút',
      difficulty: 'Thực tế',
      color: '#2196f3',
      completed: 5
    }
  ];

  const questionTypes = [
    {
      id: 'what',
      title: 'Câu hỏi WHAT',
      description: 'Câu hỏi về vật, sự việc, hoạt động. Thường bắt đầu bằng "What" và yêu cầu thông tin cụ thể.',
      icon: <QuestionAnswer />,
      count: 35,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      progress: 65,
      examples: ['What time...?', 'What kind of...?', 'What did you...?']
    },
    {
      id: 'who',
      title: 'Câu hỏi WHO',
      description: 'Câu hỏi về người, danh tính. Thường hỏi về chủ thể thực hiện hành động.',
      icon: <Person />,
      count: 28,
      color: '#388e3c',
      bgColor: '#e8f5e8',
      progress: 50,
      examples: ['Who is...?', 'Who did...?', 'Who will...?']
    },
    {
      id: 'where',
      title: 'Câu hỏi WHERE',
      description: 'Câu hỏi về địa điểm, vị trí. Yêu cầu thông tin về nơi chốn.',
      icon: <Place />,
      count: 30,
      color: '#f57c00',
      bgColor: '#fff3e0',
      progress: 40,
      examples: ['Where is...?', 'Where did...?', 'Where can I...?']
    },
    {
      id: 'when',
      title: 'Câu hỏi WHEN',
      description: 'Câu hỏi về thời gian, thời điểm. Hỏi về khi nào sự việc xảy ra.',
      icon: <Schedule />,
      count: 25,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      progress: 75,
      examples: ['When will...?', 'When did...?', 'When can...?']
    },
    {
      id: 'how',
      title: 'Câu hỏi HOW',
      description: 'Câu hỏi về cách thức, phương pháp. Bao gồm How much, How many, How long...',
      icon: <Build />,
      count: 32,
      color: '#d32f2f',
      bgColor: '#ffebee',
      progress: 55,
      examples: ['How much...?', 'How long...?', 'How often...?']
    },
    {
      id: 'why',
      title: 'Câu hỏi WHY',
      description: 'Câu hỏi về lý do, nguyên nhân. Thường yêu cầu giải thích tại sao.',
      icon: <Psychology />,
      count: 22,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      progress: 30,
      examples: ['Why did...?', 'Why don\'t...?', 'Why is...?']
    },
    {
      id: 'yesno',
      title: 'Câu hỏi YES/NO',
      description: 'Câu hỏi đóng, chỉ cần trả lời có hoặc không. Thường bắt đầu bằng động từ.',
      icon: <CheckCircle />,
      count: 40,
      color: '#388e3c',
      bgColor: '#e8f5e8',
      progress: 80,
      examples: ['Do you...?', 'Are you...?', 'Can you...?']
    },
    {
      id: 'tag',
      title: 'Câu hỏi đuôi',
      description: 'Câu hỏi có đuôi xác nhận như "isn\'t it?", "don\'t you?", "right?".',
      icon: <QuestionMark />,
      count: 18,
      color: '#f57c00',
      bgColor: '#fff3e0',
      progress: 25,
      examples: ['...isn\'t it?', '...don\'t you?', '...right?']
    },
    {
      id: 'choice',
      title: 'Câu hỏi lựa chọn',
      description: 'Câu hỏi đưa ra các lựa chọn với "or". Yêu cầu chọn một trong các phương án.',
      icon: <CompareArrows />,
      count: 20,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
      progress: 45,
      examples: ['A or B?', 'This or that?', 'Coffee or tea?']
    },
    {
      id: 'request',
      title: 'Câu yêu cầu, đề nghị',
      description: 'Câu yêu cầu, đề nghị lịch sự. Thường dùng "Could you...?", "Would you mind...?".',
      icon: <RequestPage />,
      count: 26,
      color: '#d32f2f',
      bgColor: '#ffebee',
      progress: 60,
      examples: ['Could you...?', 'Would you mind...?', 'Can you please...?']
    },
    {
      id: 'statement',
      title: 'Câu trần thuật',
      description: 'Câu khẳng định, phát biểu. Không phải câu hỏi nhưng cần phản hồi phù hợp.',
      icon: <ChatBubble />,
      count: 24,
      color: '#1976d2',
      bgColor: '#e3f2fd',
      progress: 35,
      examples: ['I think...', 'It seems...', 'The weather is...']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return '#4caf50';
      case 'Khó': return '#f44336';
      case 'Thực tế': return '#2196f3';
      default: return '#757575';
    }
  };

  return (
    <DashboardLayout>
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Part 2 - Hỏi đáp
          </Typography>
          
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4, lineHeight: 1.6 }}>
            Part 2 bao gồm 25 câu hỏi <strong>CHỈ NGHE</strong>. Bạn sẽ nghe một câu hỏi hoặc câu trần thuật, 
            sau đó nghe 3 lựa chọn A, B, C và chọn câu trả lời phù hợp nhất. 
            <strong>Không có text hiển thị</strong> - hoàn toàn dựa vào khả năng nghe hiểu.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              mb: 0,
              mt: 2,
              '& .MuiChip-root': {
                py: 2
              }
            }}
          >
            <Chip 
              icon={<Timer />} 
              label="25 câu hỏi" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<PlayArrow />} 
              label="Chỉ nghe - Không đọc" 
              color="secondary" 
              variant="outlined" 
            />
            <Chip 
              icon={<Star />} 
              label="Điểm tối đa: 125" 
              color="primary" 
              variant="filled" 
            />
          </Stack>
        </Box>

        {/* Section 1: Luyện tập */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: 3, 
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TrendingUp /> 
            Luyện tập
          </Typography>
          
          <Grid container spacing={3}>
            {practiceItems.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  border: `1px solid ${item.color}20`,
                }}>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PlayArrow sx={{ color: item.color, mr: 1, fontSize: 28 }} />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    
                    <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.5 }}>
                      {item.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          label={`${item.lessons} bài học`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          label={item.duration}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Stack>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Hoàn thành: {item.completed}/{item.lessons}
                        </Typography>
                        <Chip 
                          label={item.difficulty}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getDifficultyColor(item.difficulty)}20`,
                            color: getDifficultyColor(item.difficulty),
                            fontWeight: 'medium',
                            fontSize: '11px'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Progress bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tiến độ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round((item.completed / item.lessons) * 100)}%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 6, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 3,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: `${(item.completed / item.lessons) * 100}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          transition: 'width 0.3s ease-in-out'
                        }} />
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      sx={{ 
                        backgroundColor: item.color,
                        '&:hover': {
                          backgroundColor: `${item.color}dd`
                        }
                      }}
                    >
                      {item.completed === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 5, borderColor: 'primary.main', borderWidth: 1 }} />

        {/* Section 2: Các loại câu hỏi */}
        <Box>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: 3, 
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Category />
            Các loại câu hỏi thường gặp
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Nắm vững các loại câu hỏi quan trọng trong Part 2. Mỗi loại câu hỏi có đặc điểm và cách trả lời riêng, 
            giúp bạn phản xạ nhanh và chính xác trong bài thi.
          </Typography>
          
          <Grid container spacing={3}>
            {questionTypes.map((type, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    '& .question-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  },
                  border: `2px solid ${type.bgColor}`,
                  backgroundColor: type.bgColor + '40',
                }}>
                  {/* Progress indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: '#f0f0f0'
                  }}>
                    <Box sx={{
                      height: '100%',
                      width: `${type.progress}%`,
                      backgroundColor: type.color,
                      transition: 'width 0.3s ease-in-out'
                    }} />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                    <Box 
                      className="question-icon"
                      sx={{ 
                        mb: 2,
                        transition: 'transform 0.3s ease-in-out',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: type.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        boxShadow: 2
                      }}>
                        {type.icon}
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom sx={{ 
                      color: type.color,
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.1rem'
                    }}>
                      {type.title}
                    </Typography>
                    
                    <Typography color="text.secondary" sx={{ 
                      mb: 3, 
                      fontSize: '13px',
                      lineHeight: 1.4,
                      minHeight: '60px'
                    }}>
                      {type.description}
                    </Typography>

                    {/* Examples */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        mb: 1, 
                        display: 'block',
                        fontWeight: 'medium'
                      }}>
                        Ví dụ:
                      </Typography>
                      <Stack spacing={0.5}>
                        {type.examples.slice(0, 2).map((example, idx) => (
                          <Chip
                            key={idx}
                            label={example}
                            size="small"
                            sx={{ 
                              backgroundColor: type.color + '15',
                              color: type.color,
                              fontSize: '10px',
                              height: '20px',
                              fontWeight: 'medium'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={`${type.count} câu`}
                        size="small"
                        sx={{ 
                          backgroundColor: type.color + '20',
                          color: type.color,
                          fontWeight: 'medium'
                        }}
                      />
                      <Chip 
                        label={`${type.progress}%`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      size="large"
                      component={Link}
                      href={`/practice/part2/questions/${type.id}`}
                      sx={{ 
                        backgroundColor: type.color,
                        fontWeight: 'medium',
                        '&:hover': {
                          backgroundColor: `${type.color}dd`
                        }
                      }}
                    >
                      {type.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          mt: 6, 
          p: 4, 
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)', 
          borderRadius: 3,
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
            🎧 Sẵn sàng thử thách Part 2?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Phần khó nhất của TOEIC Listening! Chỉ được nghe 1 lần duy nhất, không có text hỗ trợ. 
            Hãy rèn luyện khả năng nghe hiểu và phản xạ nhanh của bạn!
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              🔥 Thử thách ngay
            </Button>
            <Button
              variant="outlined" 
              size="large"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              💡 Xem mẹo làm bài
            </Button>
          </Stack>
          
          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8, fontStyle: 'italic' }}>
            ⚠️ Lưu ý: Trong thi thực tế, bạn sẽ KHÔNG thấy câu hỏi và đáp án dưới dạng text!
          </Typography>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
