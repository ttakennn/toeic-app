'use client';

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
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  Category,
  MenuBook,
  Quiz
} from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface TestSummary {
  id: number;
  title: string;
  difficulty: string;
  questions: number;
  duration: string;
  available: boolean;
  description?: string;
}

interface PracticeCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalTests: number;
  availableTests: number;
  tests: TestSummary[];
}

interface PracticeQuestionsResponse {
  success: boolean;
  categories: PracticeCategory[];
  totalCategories: number;
  totalTests: number;
  totalAvailable: number;
  completionRate: number;
  timestamp: string;
}

export default function Part2Page() {
  // State để quản lý đề TEST được chọn cho mỗi practice item
  const [selectedPracticeTests, setSelectedPracticeTests] = useState<{[key: string]: number}>({});

  // State để quản lý practice categories
  const [practiceCategories, setPracticeCategories] = useState<PracticeCategory[]>([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  // Data cho section hướng dẫn
  const guideItems = [
    {
      id: 'what',
      title: 'Câu hỏi WHAT',
      description: 'Hỏi về vật, sự việc, hoạt động. Thường yêu cầu thông tin cụ thể về "cái gì".',
      icon: <QuestionAnswer />,
      tips: [
        'Chú ý từ khóa: What time, What kind, What type...',
        'Câu trả lời thường chứa thông tin cụ thể',
        'Tránh những câu trả lời về thời gian, địa điểm không phù hợp'
      ],
      examples: ['What time...?', 'What kind of...?', 'What did you...?'],
      color: '#1976d2',
      bgColor: '#e3f2fd'
    },
    {
      id: 'who',
      title: 'Câu hỏi WHO',
      description: 'Hỏi về người, danh tính. Thường hỏi về chủ thể thực hiện hành động.',
      icon: <Person />,
      tips: [
        'Câu trả lời thường là tên người hoặc chức danh',
        'Chú ý phân biệt giữa "who" và "whom"',
        'Có thể có câu trả lời gián tiếp như "My colleague"'
      ],
      examples: ['Who is...?', 'Who did...?', 'Who will...?'],
      color: '#388e3c',
      bgColor: '#e8f5e8'
    },
    {
      id: 'where',
      title: 'Câu hỏi WHERE',
      description: 'Hỏi về địa điểm, vị trí. Yêu cầu thông tin về nơi chốn.',
      icon: <Place />,
      tips: [
        'Câu trả lời thường chỉ địa điểm cụ thể',
        'Chú ý các từ chỉ phương hướng',
        'Có thể có câu trả lời như "Over there", "Upstairs"'
      ],
      examples: ['Where is...?', 'Where did...?', 'Where can I...?'],
      color: '#f57c00',
      bgColor: '#fff3e0'
    },
    {
      id: 'when',
      title: 'Câu hỏi WHEN',
      description: 'Hỏi về thời gian, thời điểm. Hỏi về khi nào sự việc xảy ra.',
      icon: <Schedule />,
      tips: [
        'Câu trả lời thường chứa thời gian cụ thể',
        'Chú ý các từ như "tomorrow", "next week", "at 3 PM"',
        'Có thể có câu trả lời tương đối như "Soon", "Later"'
      ],
      examples: ['When will...?', 'When did...?', 'When can...?'],
      color: '#7b1fa2',
      bgColor: '#f3e5f5'
    },
    {
      id: 'how',
      title: 'Câu hỏi HOW',
      description: 'Hỏi về cách thức, phương pháp. Bao gồm How much, How many, How long...',
      icon: <Build />,
      tips: [
        'How much/many: hỏi về số lượng, giá cả',
        'How long: hỏi về thời gian kéo dài',
        'How often: hỏi về tần suất'
      ],
      examples: ['How much...?', 'How long...?', 'How often...?'],
      color: '#d32f2f',
      bgColor: '#ffebee'
    },
    {
      id: 'why',
      title: 'Câu hỏi WHY',
      description: 'Hỏi về lý do, nguyên nhân. Thường yêu cầu giải thích tại sao.',
      icon: <Psychology />,
      tips: [
        'Câu trả lời thường bắt đầu bằng "Because"',
        'Có thể trả lời bằng "To + verb" (mục đích)',
        'Chú ý câu trả lời gián tiếp'
      ],
      examples: ['Why did...?', 'Why don\'t...?', 'Why is...?'],
      color: '#1976d2',
      bgColor: '#e3f2fd'
    },
    {
      id: 'yesno',
      title: 'Câu hỏi YES/NO',
      description: 'Câu hỏi đóng, có thể trả lời Yes/No hoặc thông tin tương đương.',
      icon: <CheckCircle />,
      tips: [
        'Không nhất thiết phải trả lời "Yes" hoặc "No"',
        'Có thể trả lời gián tiếp như "I think so", "Of course"',
        'Chú ý intonation để phân biệt câu hỏi'
      ],
      examples: ['Do you...?', 'Are you...?', 'Can you...?'],
      color: '#388e3c',
      bgColor: '#e8f5e8'
    },
    {
      id: 'others',
      title: 'Các loại khác',
      description: 'Câu hỏi đuôi, lựa chọn, yêu cầu, và câu trần thuật cần phản hồi.',
      icon: <QuestionMark />,
      tips: [
        'Câu hỏi đuôi: ...isn\'t it?, ...don\'t you?',
        'Câu lựa chọn: A or B?',
        'Yêu cầu: Could you...?, Would you mind...?'
      ],
      examples: ['...right?', 'Coffee or tea?', 'Could you help...?'],
      color: '#ff9800',
      bgColor: '#fff3e0'
    }
  ];

  const handlePracticeTestChange = (practiceId: string, testNumber: number) => {
    setSelectedPracticeTests(prev => ({
      ...prev,
      [practiceId]: testNumber
    }));
  };

  // Fetch practice questions from API
  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      try {
        setPracticeLoading(true);
        setPracticeError(null);

        const response = await fetch('/api/part2/questions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PracticeQuestionsResponse = await response.json();
        if (!data.success) {
          throw new Error('Failed to fetch practice questions');
        }

        setPracticeCategories(data.categories);
        
        // Initialize selected tests with first available test for each category
        const initialSelected: {[key: string]: number} = {};
        data.categories.forEach(category => {
          const firstAvailableTest = category.tests.find(test => test.available);
          initialSelected[category.id] = firstAvailableTest ? firstAvailableTest.id : 1;
        });
        setSelectedPracticeTests(initialSelected);
        
      } catch (error) {
        console.error('Error fetching practice questions:', error);
        setPracticeError('Không thể tải danh sách bài luyện tập. Vui lòng thử lại.');
      } finally {
        setPracticeLoading(false);
      }
    };

    fetchPracticeQuestions();
  }, []);

  // Handle start test button click
  const handleStartTest = async (categoryId: string, testId: number) => {
    const category = practiceCategories.find(cat => cat.id === categoryId);
    const test = category?.tests.find(t => t.id === testId);
    
    if (!test) {
      alert('Không tìm thấy bài test này!');
      return;
    }
    
    if (!test.available) {
      alert('Bài test này chưa có sẵn. Vui lòng chọn bài test khác!');
      return;
    }

    // Navigate to test page
    window.location.href = `/practice/part2/questions/${categoryId}/test?testId=${testId}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return '#4caf50';
      case 'TB': return '#ff9800';
      case 'Khó': return '#f44336';
      case 'Trung bình': return '#ff9800';
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

        {/* Section 1: Hướng dẫn */}
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
            <MenuBook /> 
            Hướng dẫn làm bài
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Tìm hiểu cách làm từng loại câu hỏi trong Part 2. Nắm vững đặc điểm và mẹo làm bài cho từng dạng câu hỏi
            để đạt điểm cao trong phần thi này.
          </Typography>
          
          <Grid container spacing={3}>
            {guideItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                    '& .guide-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  },
                  border: `2px solid ${item.bgColor}`,
                  backgroundColor: item.bgColor + '40',
                }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                    <Box 
                      className="guide-icon"
                      sx={{ 
                        mb: 2,
                        transition: 'transform 0.3s ease-in-out',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Box sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '28px',
                        boxShadow: 2
                      }}>
                        {item.icon}
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom sx={{ 
                      color: item.color,
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.1rem'
                    }}>
                      {item.title}
                    </Typography>
                    
                    <Typography color="text.secondary" sx={{ 
                      mb: 2, 
                      fontSize: '13px',
                      lineHeight: 1.4,
                      minHeight: '40px'
                    }}>
                      {item.description}
                    </Typography>

                    {/* Examples */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        mb: 1, 
                        display: 'block',
                        fontWeight: 'medium'
                      }}>
                        Ví dụ:
                      </Typography>
                      <Stack spacing={0.5}>
                        {item.examples.slice(0, 2).map((example, idx) => (
                          <Chip
                            key={idx}
                            label={example}
                            size="small"
                            sx={{ 
                              backgroundColor: item.color + '15',
                              color: item.color,
                              fontSize: '10px',
                              height: '20px',
                              fontWeight: 'medium'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Tips */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ 
                        mb: 1, 
                        display: 'block',
                        fontWeight: 'medium'
                      }}>
                        💡 Mẹo:
                      </Typography>
                      <Box sx={{ 
                        textAlign: 'left',
                        backgroundColor: item.bgColor + '60',
                        p: 1.5,
                        borderRadius: 1,
                        border: `1px solid ${item.color}30`
                      }}>
                        {item.tips.slice(0, 2).map((tip, idx) => (
                          <Typography key={idx} variant="caption" sx={{ 
                            display: 'block',
                            color: 'text.secondary',
                            fontSize: '11px',
                            lineHeight: 1.3,
                            mb: idx < item.tips.length - 1 ? 0.5 : 0
                          }}>
                            • {tip}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      size="small"
                      sx={{ 
                        borderColor: item.color,
                        color: item.color,
                        fontWeight: 'medium',
                        '&:hover': {
                          borderColor: item.color,
                          backgroundColor: item.color + '10'
                        }
                      }}
                    >
                      📖 Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 5, borderColor: 'primary.main', borderWidth: 1 }} />

        {/* Section 2: Luyện đề */}
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
            <TrendingUp />
            Luyện đề
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Luyện tập với các bài test chuyên sâu theo từng loại câu hỏi. Chọn đề test phù hợp với trình độ 
            và bắt đầu luyện tập ngay để cải thiện kỹ năng Part 2.
          </Typography>
          
          {practiceError && (
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#ffebee', 
              borderRadius: 2, 
              mb: 3,
              textAlign: 'center'
            }}>
              <Typography color="error" variant="h6" gutterBottom>
                ⚠️ Lỗi tải dữ liệu luyện tập
              </Typography>
              <Typography color="error" variant="body2">
                {practiceError}
              </Typography>
              <Button 
                variant="outlined" 
                color="error" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </Box>
          )}
          
          <Grid container spacing={3}>
            {practiceLoading ? (
              // Loading skeleton for practice items
              Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`practice-skeleton-${index}`}>
                  <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 1,
                          mr: 2 
                        }} />
                        <Box sx={{ 
                          height: 24, 
                          width: '60%',
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 1,
                          mr: 'auto'
                        }} />
                        <Box sx={{ 
                          width: 60, 
                          height: 20, 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: 1
                        }} />
                      </Box>
                      <Box sx={{ 
                        height: 40, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1,
                        mb: 3 
                      }} />
                      <Box sx={{ 
                        height: 80, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1,
                        mb: 3 
                      }} />
                      <Box sx={{ 
                        height: 120, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1
                      }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              practiceCategories.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
                    '& .practice-icon': {
                      transform: 'scale(1.1)',
                    }
                  },
                  border: `2px solid ${item.color}40`,
                  backgroundColor: item.bgColor + '20',
                }}>
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        className="practice-icon"
                        sx={{ 
                          mr: 2,
                          transition: 'transform 0.3s ease-in-out'
                        }}
                      >
                        <Box 
                          component="img"
                          src={item.icon}
                          alt={item.title}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'contain'
                          }}
                        />
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ 
                        fontWeight: 600,
                        color: item.color,
                        flex: 1
                      }}>
                        {item.title}
                      </Typography>
                      <Chip 
                        label={`${item.totalTests} TEST`}
                        size="small"
                        sx={{ 
                          backgroundColor: item.color + '20',
                          color: item.color,
                          fontWeight: 'medium'
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
                            '&.Mui-focused': { color: item.color }
                          }}
                        >
                          Chọn đề TEST
                        </InputLabel>
                        <Select
                          value={selectedPracticeTests[item.id] || 1}
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
                              fontWeight: 'medium'
                            }
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
                                        backgroundColor: getDifficultyColor(test.difficulty) + '20',
                                        color: getDifficultyColor(test.difficulty)
                                      }}
                                    />
                                    <Chip 
                                      label={`${test.questions} câu`}
                                      size="small"
                                      sx={{ 
                                        height: 16,
                                        fontSize: '10px',
                                        backgroundColor: item.color + '20',
                                        color: item.color
                                      }}
                                    />
                                    <Chip 
                                      label={test.duration}
                                      size="small"
                                      sx={{ 
                                        height: 16,
                                        fontSize: '10px',
                                        backgroundColor: '#e0e0e0',
                                        color: '#666'
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
                          📋 {item.tests.find(test => test.id === selectedPracticeTests[item.id])?.title}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            label={item.tests.find(test => test.id === selectedPracticeTests[item.id])?.difficulty}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(item.tests.find(test => test.id === selectedPracticeTests[item.id])?.difficulty || 'Dễ') + '20',
                              color: getDifficultyColor(item.tests.find(test => test.id === selectedPracticeTests[item.id])?.difficulty || 'Dễ'),
                              fontWeight: 'medium'
                            }}
                          />
                          <Chip 
                            label={`${item.tests.find(test => test.id === selectedPracticeTests[item.id])?.questions} câu hỏi`}
                            size="small"
                            sx={{ 
                              backgroundColor: item.color + '20',
                              color: item.color,
                              fontWeight: 'medium'
                            }}
                          />
                          <Chip 
                            label={item.tests.find(test => test.id === selectedPracticeTests[item.id])?.duration}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: item.color,
                              color: item.color,
                              fontWeight: 'medium'
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
                      disabled={!item.tests.find(test => test.id === selectedPracticeTests[item.id])?.available}
                      sx={{ 
                        backgroundColor: item.color,
                        fontWeight: 'medium',
                        '&:hover': {
                          backgroundColor: `${item.color}dd`
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#e0e0e0',
                          color: '#999'
                        }
                      }}
                    >
                      {item.tests.find(test => test.id === selectedPracticeTests[item.id])?.available 
                        ? `🚀 Bắt đầu ${item.tests.find(test => test.id === selectedPracticeTests[item.id])?.title}`
                        : '⚠️ Chưa có sẵn'
                      }
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              ))
            )}
          </Grid>
          
          {!practiceLoading && practiceCategories.length === 0 && !practiceError && (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 2
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📋 Chưa có bài luyện tập nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hệ thống đang được cập nhật. Vui lòng quay lại sau.
              </Typography>
            </Box>
          )}
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