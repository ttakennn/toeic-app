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
  Category,
  Timer,
  Star,
  TrendingUp,
  Quiz
} from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PhraseCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  bgColor: string;
  progress: number;
}

interface PhraseCategoriesResponse {
  success: boolean;
  categories: PhraseCategory[];
  totalCategories: number;
  timestamp: string;
}

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

export default function Part1Page() {
  // State để quản lý đề TEST được chọn cho mỗi practice item
  const [selectedPracticeTests, setSelectedPracticeTests] = useState<{[key: string]: number}>({
    'basic': 1,
    'advanced': 1,
    'simulation': 1,
    'mixed': 1
  });

  // State để quản lý phrase categories
  const [phraseCategories, setPhraseCategories] = useState<PhraseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // State để quản lý practice categories
  const [practiceCategories, setPracticeCategories] = useState<PracticeCategory[]>([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  const handlePracticeTestChange = (practiceId: string, testNumber: number) => {
    setSelectedPracticeTests(prev => ({
      ...prev,
      [practiceId]: testNumber
    }));
  };

  // Fetch phrase categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);

        const response = await fetch('/api/part1/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PhraseCategoriesResponse = await response.json();
        if (!data.success) {
          throw new Error('Failed to fetch categories');
        }

        setPhraseCategories(data.categories);
      } catch (error) {
        console.error('Error fetching phrase categories:', error);
        setCategoriesError('Không thể tải danh sách cụm từ. Vui lòng thử lại.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch practice questions from API
  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      try {
        setPracticeLoading(true);
        setPracticeError(null);

        const response = await fetch('/api/part1/questions');
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
    window.location.href = `/practice/part1/${categoryId}/test?testId=${testId}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return '#4caf50';
      case 'TB': return '#ff9800';
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
            Part 1 - Mô tả hình ảnh
          </Typography>
          
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4, lineHeight: 1.6 }}>
            Part 1 bao gồm 6 câu hỏi. Bạn sẽ nghe 4 câu mô tả ngắn về một bức ảnh trong sách thi 
            và chọn câu mô tả chính xác nhất. Đây là phần khởi động quan trọng để bắt đầu bài thi TOEIC.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              mb: 0,
              mt: 2, // Thêm margin-top cho Stack
              '& .MuiChip-root': {
                py: 2
              }
            }}
          >
            <Chip 
              icon={<Timer />} 
              label="6 câu hỏi" 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<PlayArrow />} 
              label="Nghe mô tả" 
              color="secondary" 
              variant="outlined" 
            />
            <Chip 
              icon={<Star />} 
              label="Điểm tối đa: 30" 
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
              Array.from({ length: 4 }).map((_, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={`practice-skeleton-${index}`}>
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
              <Grid size={{ xs: 12, md: 6 }} key={index}>
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

        <Divider sx={{ my: 5, borderColor: 'primary.main', borderWidth: 1 }} />

        {/* Section 2: Cụm từ thường gặp */}
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
            Cụm từ thường gặp
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Nắm vững các cụm từ quan trọng để mô tả hình ảnh chính xác trong Part 1. 
            Mỗi danh mục được thiết kế để bạn học từ vựng theo chủ đề một cách có hệ thống.
          </Typography>
          
          {categoriesError && (
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#ffebee', 
              borderRadius: 2, 
              mb: 3,
              textAlign: 'center'
            }}>
              <Typography color="error" variant="h6" gutterBottom>
                ⚠️ Lỗi tải dữ liệu
              </Typography>
              <Typography color="error" variant="body2">
                {categoriesError}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={3}>
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${index}`}>
                  <Card sx={{ height: 320, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                      <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1,
                        mx: 'auto',
                        mb: 2 
                      }} />
                      <Box sx={{ 
                        height: 24, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1,
                        mb: 1 
                      }} />
                      <Box sx={{ 
                        height: 40, 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: 1,
                        mb: 2 
                      }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              phraseCategories.map((category, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                    '& .category-icon': {
                      transform: 'scale(1.1)',
                    }
                  },
                  border: `2px solid ${category.bgColor}`,
                  backgroundColor: category.bgColor + '40',
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
                      width: `${category.progress}%`,
                      backgroundColor: category.color,
                      transition: 'width 0.3s ease-in-out'
                    }} />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                    <Box 
                      className="category-icon"
                      sx={{ 
                        mb: 2,
                        transition: 'transform 0.3s ease-in-out'
                      }}
                    >
                      <Box 
                        component="img"
                        src={category.icon}
                        alt={category.title}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom sx={{ 
                      color: category.color,
                      fontWeight: 600,
                      mb: 2
                    }}>
                      {category.title}
                    </Typography>
                    
                    <Typography color="text.secondary" sx={{ 
                      mb: 3, 
                      fontSize: '14px',
                      lineHeight: 1.5
                    }}>
                      {category.description}
                    </Typography>

                    <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={`${category.count} cụm từ`}
                        size="small"
                        sx={{ 
                          backgroundColor: category.color + '20',
                          color: category.color,
                          fontWeight: 'medium'
                        }}
                      />
                      <Chip 
                        label={`${category.progress}%`}
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
                      href={`/practice/part1/phrases/${category.id}`}
                      sx={{ 
                        backgroundColor: category.color,
                        fontWeight: 'medium',
                        '&:hover': {
                          backgroundColor: `${category.color}dd`
                        }
                      }}
                    >
                      {category.progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              ))
            )}
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
            🎯 Sẵn sàng chinh phục Part 1?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Bắt đầu với những bài luyện tập cơ bản và dần nâng cao trình độ của bạn!
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
              Bắt đầu luyện tập
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
              Xem hướng dẫn
            </Button>
          </Stack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
