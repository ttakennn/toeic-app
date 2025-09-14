'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton,
  Collapse,
  Avatar,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Fade,
  Tooltip,
  Grid,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { 
  PlayArrow, 
  Pause,
  ArrowBack,
  NavigateBefore,
  NavigateNext,
  VolumeUp,
  VolumeOff,
  Repeat,
  BookmarkBorder,
  Bookmark,
  Speed,
  CheckCircle,
  Cancel,
  QuestionAnswer,
  Person,
  Place,
  Schedule,
  Build,
  Psychology,
  CompareArrows,
  RequestPage,
  ChatBubble,
  QuestionMark,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';

interface QuestionData {
  id: number;
  audio: string;
  question: string;
  questionVietnamese: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  optionsVietnamese: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: 'a' | 'b' | 'c';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// Sample data - in real app this would come from API/database
const questionsData: { [key: string]: { title: string; description: string; icon: React.ReactNode; data: QuestionData[] } } = {
  'what': {
    title: 'Câu hỏi WHAT',
    description: 'Câu hỏi về vật, sự việc, hoạt động',
    icon: <QuestionAnswer />,
    data: [
      {
        id: 1,
        audio: '/audio/what-question-1.mp3',
        question: 'What time does the meeting start?',
        questionVietnamese: 'Cuộc họp bắt đầu lúc mấy giờ?',
        options: {
          a: 'At 9 o\'clock.',
          b: 'In the conference room.',
          c: 'About two hours.'
        },
        optionsVietnamese: {
          a: 'Lúc 9 giờ.',
          b: 'Trong phòng họp.',
          c: 'Khoảng hai tiếng.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi "What time" yêu cầu thông tin về thời gian, nên đáp án A "At 9 o\'clock" là phù hợp nhất.',
        difficulty: 'easy',
        tags: ['time', 'meeting', 'schedule']
      },
      {
        id: 2,
        audio: '/audio/what-question-2.mp3',
        question: 'What kind of coffee would you like?',
        questionVietnamese: 'Bạn muốn loại cà phê nào?',
        options: {
          a: 'Yes, please.',
          b: 'Black coffee, please.',
          c: 'In a few minutes.'
        },
        optionsVietnamese: {
          a: 'Vâng, làm ơn.',
          b: 'Cà phê đen, làm ơn.',
          c: 'Trong vài phút nữa.'
        },
        correctAnswer: 'b',
        explanation: 'Câu hỏi "What kind of" yêu cầu thông tin về loại/kiểu, nên đáp án B "Black coffee, please" là chính xác.',
        difficulty: 'easy',
        tags: ['coffee', 'preference', 'food']
      }
    ]
  },
  'who': {
    title: 'Câu hỏi WHO',
    description: 'Câu hỏi về người, danh tính',
    icon: <Person />,
    data: [
      {
        id: 1,
        audio: '/audio/who-question-1.mp3',
        question: 'Who is presenting at the conference?',
        questionVietnamese: 'Ai sẽ thuyết trình tại hội nghị?',
        options: {
          a: 'Next Friday.',
          b: 'Dr. Johnson.',
          c: 'In the main hall.'
        },
        optionsVietnamese: {
          a: 'Thứ Sáu tới.',
          b: 'Tiến sĩ Johnson.',
          c: 'Trong hội trường chính.'
        },
        correctAnswer: 'b',
        explanation: 'Câu hỏi "Who" yêu cầu thông tin về người, nên đáp án B "Dr. Johnson" là đúng.',
        difficulty: 'medium',
        tags: ['person', 'conference', 'presentation']
      }
    ]
  },
  'where': {
    title: 'Câu hỏi WHERE',
    description: 'Câu hỏi về địa điểm, vị trí',
    icon: <Place />,
    data: [
      {
        id: 1,
        audio: '/audio/where-question-1.mp3',
        question: 'Where can I find the restroom?',
        questionVietnamese: 'Tôi có thể tìm nhà vệ sinh ở đâu?',
        options: {
          a: 'Down the hall on your right.',
          b: 'It\'s very clean.',
          c: 'About 10 minutes ago.'
        },
        optionsVietnamese: {
          a: 'Cuối hành lang bên phải.',
          b: 'Nó rất sạch sẽ.',
          c: 'Khoảng 10 phút trước.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi "Where" yêu cầu thông tin về vị trí, nên đáp án A chỉ đường là chính xác.',
        difficulty: 'easy',
        tags: ['location', 'direction', 'restroom']
      }
    ]
  },
  'when': {
    title: 'Câu hỏi WHEN',
    description: 'Câu hỏi về thời gian, thời điểm',
    icon: <Schedule />,
    data: [
      {
        id: 1,
        audio: '/audio/when-question-1.mp3',
        question: 'When will the report be ready?',
        questionVietnamese: 'Khi nào báo cáo sẽ sẵn sàng?',
        options: {
          a: 'By tomorrow afternoon.',
          b: 'In the manager\'s office.',
          c: 'About 50 pages.'
        },
        optionsVietnamese: {
          a: 'Vào chiều mai.',
          b: 'Trong văn phòng quản lý.',
          c: 'Khoảng 50 trang.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi "When" yêu cầu thông tin về thời gian, nên đáp án A "By tomorrow afternoon" là đúng.',
        difficulty: 'medium',
        tags: ['time', 'deadline', 'report']
      }
    ]
  },
  'how': {
    title: 'Câu hỏi HOW',
    description: 'Câu hỏi về cách thức, phương pháp',
    icon: <Build />,
    data: [
      {
        id: 1,
        audio: '/audio/how-question-1.mp3',
        question: 'How much does this cost?',
        questionVietnamese: 'Cái này giá bao nhiêu?',
        options: {
          a: 'It\'s very expensive.',
          b: 'Fifty dollars.',
          c: 'I bought it yesterday.'
        },
        optionsVietnamese: {
          a: 'Nó rất đắt.',
          b: 'Năm mười đô la.',
          c: 'Tôi mua nó hôm qua.'
        },
        correctAnswer: 'b',
        explanation: 'Câu hỏi "How much" yêu cầu thông tin về giá cả, nên đáp án B "Fifty dollars" là chính xác.',
        difficulty: 'easy',
        tags: ['price', 'money', 'cost']
      }
    ]
  },
  'why': {
    title: 'Câu hỏi WHY',
    description: 'Câu hỏi về lý do, nguyên nhân',
    icon: <Psychology />,
    data: [
      {
        id: 1,
        audio: '/audio/why-question-1.mp3',
        question: 'Why is the meeting postponed?',
        questionVietnamese: 'Tại sao cuộc họp bị hoãn?',
        options: {
          a: 'At 3 PM.',
          b: 'Because the manager is sick.',
          c: 'In the conference room.'
        },
        optionsVietnamese: {
          a: 'Lúc 3 giờ chiều.',
          b: 'Vì quản lý bị ốm.',
          c: 'Trong phòng họp.'
        },
        correctAnswer: 'b',
        explanation: 'Câu hỏi "Why" yêu cầu lý do, nên đáp án B "Because the manager is sick" là đúng.',
        difficulty: 'medium',
        tags: ['reason', 'meeting', 'postpone']
      }
    ]
  },
  'yesno': {
    title: 'Câu hỏi YES/NO',
    description: 'Câu hỏi đóng, chỉ cần trả lời có hoặc không',
    icon: <CheckCircle />,
    data: [
      {
        id: 1,
        audio: '/audio/yesno-question-1.mp3',
        question: 'Do you have any questions?',
        questionVietnamese: 'Bạn có câu hỏi nào không?',
        options: {
          a: 'Yes, I do.',
          b: 'About ten minutes.',
          c: 'In the lobby.'
        },
        optionsVietnamese: {
          a: 'Có, tôi có.',
          b: 'Khoảng mười phút.',
          c: 'Trong sảnh.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi Yes/No với "Do you" cần trả lời Yes/No, nên đáp án A "Yes, I do" là phù hợp.',
        difficulty: 'easy',
        tags: ['yes-no', 'question', 'confirmation']
      }
    ]
  },
  'tag': {
    title: 'Câu hỏi đuôi',
    description: 'Câu hỏi có đuôi xác nhận',
    icon: <QuestionMark />,
    data: [
      {
        id: 1,
        audio: '/audio/tag-question-1.mp3',
        question: 'The weather is nice today, isn\'t it?',
        questionVietnamese: 'Thời tiết hôm nay đẹp, phải không?',
        options: {
          a: 'Yes, it is.',
          b: 'Tomorrow morning.',
          c: 'About 25 degrees.'
        },
        optionsVietnamese: {
          a: 'Vâng, đúng vậy.',
          b: 'Sáng mai.',
          c: 'Khoảng 25 độ.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi đuôi "isn\'t it?" cần sự đồng tình, nên đáp án A "Yes, it is" là đúng.',
        difficulty: 'medium',
        tags: ['tag-question', 'weather', 'agreement']
      }
    ]
  },
  'choice': {
    title: 'Câu hỏi lựa chọn',
    description: 'Câu hỏi đưa ra các lựa chọn với "or"',
    icon: <CompareArrows />,
    data: [
      {
        id: 1,
        audio: '/audio/choice-question-1.mp3',
        question: 'Would you like coffee or tea?',
        questionVietnamese: 'Bạn muốn cà phê hay trà?',
        options: {
          a: 'Coffee, please.',
          b: 'Yes, I would.',
          c: 'At 2 o\'clock.'
        },
        optionsVietnamese: {
          a: 'Cà phê, làm ơn.',
          b: 'Vâng, tôi muốn.',
          c: 'Lúc 2 giờ.'
        },
        correctAnswer: 'a',
        explanation: 'Câu hỏi lựa chọn "coffee or tea" cần chọn một trong hai, nên đáp án A "Coffee, please" là đúng.',
        difficulty: 'easy',
        tags: ['choice', 'beverage', 'preference']
      }
    ]
  },
  'request': {
    title: 'Câu yêu cầu, đề nghị',
    description: 'Câu yêu cầu, đề nghị lịch sự',
    icon: <RequestPage />,
    data: [
      {
        id: 1,
        audio: '/audio/request-question-1.mp3',
        question: 'Could you help me with this report?',
        questionVietnamese: 'Bạn có thể giúp tôi với báo cáo này không?',
        options: {
          a: 'Of course, I\'d be happy to.',
          b: 'It\'s on the desk.',
          c: 'About 20 pages.'
        },
        optionsVietnamese: {
          a: 'Tất nhiên, tôi rất sẵn lòng.',
          b: 'Nó ở trên bàn.',
          c: 'Khoảng 20 trang.'
        },
        correctAnswer: 'a',
        explanation: 'Câu yêu cầu "Could you help" cần phản hồi về việc đồng ý/từ chối, nên đáp án A là phù hợp.',
        difficulty: 'medium',
        tags: ['request', 'help', 'polite']
      }
    ]
  },
  'statement': {
    title: 'Câu trần thuật',
    description: 'Câu khẳng định, phát biểu',
    icon: <ChatBubble />,
    data: [
      {
        id: 1,
        audio: '/audio/statement-1.mp3',
        question: 'I think the presentation went well.',
        questionVietnamese: 'Tôi nghĩ buổi thuyết trình diễn ra tốt.',
        options: {
          a: 'Yes, everyone seemed interested.',
          b: 'At 3 o\'clock.',
          c: 'In the main conference room.'
        },
        optionsVietnamese: {
          a: 'Vâng, mọi người có vẻ quan tâm.',
          b: 'Lúc 3 giờ.',
          c: 'Trong phòng họp chính.'
        },
        correctAnswer: 'a',
        explanation: 'Câu trần thuật về ý kiến cần phản hồi đồng tình hoặc bổ sung, nên đáp án A là phù hợp.',
        difficulty: 'medium',
        tags: ['statement', 'opinion', 'presentation']
      }
    ]
  }
};

export default function QuestionTypePage() {
  const params = useParams();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | 'c' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const questionType = params.type as string;
  const typeData = questionsData[questionType];

  if (!typeData) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            😔 Không tìm thấy loại câu hỏi
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Loại câu hỏi bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/practice/part2')}>
            Quay lại Part 2
          </Button>
        </Box>
      </DashboardLayout>
    );
  }

  const currentQuestion = typeData.data[currentIndex];
  const progress = ((currentIndex + 1) / typeData.data.length) * 100;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetQuestionState();
    }
  };

  const handleNext = () => {
    if (currentIndex < typeData.data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionState();
    }
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowTranslation(false);
    setAudioProgress(0);
  };

  const handleAnswerSelect = (answer: 'a' | 'b' | 'c') => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setShowResult(true);
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
      }));
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Simulate audio playback with progress
      const duration = 4000; // 4 seconds
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      let step = 0;
      
      const progressInterval = setInterval(() => {
        step++;
        setAudioProgress((step / steps) * 100);
        
        if (step >= steps) {
          clearInterval(progressInterval);
          setIsPlaying(false);
          setAudioProgress(0);
        }
      }, interval);
    } else {
      setAudioProgress(0);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentSpeedIndex = speeds.indexOf(playbackSpeed);
    const nextSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextSpeedIndex]);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleBack = () => {
    router.push('/practice/part2');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#757575';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Không xác định';
    }
  };

  const getAnswerColor = (option: 'a' | 'b' | 'c') => {
    if (!showResult) {
      return selectedAnswer === option ? 'primary.main' : 'grey.300';
    }
    
    if (option === currentQuestion.correctAnswer) {
      return '#4caf50'; // Green for correct answer
    }
    
    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return '#f44336'; // Red for wrong selected answer
    }
    
    return 'grey.300';
  };

  const getAnswerIcon = (option: 'a' | 'b' | 'c') => {
    if (!showResult) return null;
    
    if (option === currentQuestion.correctAnswer) {
      return <CheckCircle sx={{ color: '#4caf50', ml: 1 }} />;
    }
    
    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return <Cancel sx={{ color: '#f44336', ml: 1 }} />;
    }
    
    return null;
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 2 }}
            variant="outlined"
          >
            Quay lại Part 2
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              mr: 2, 
              p: 1, 
              borderRadius: '50%', 
              backgroundColor: 'primary.light',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {typeData.icon}
            </Box>
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 600 }}>
              {typeData.title}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {typeData.description}
          </Typography>

          {/* Progress Info */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Câu {currentIndex + 1} / {typeData.data.length}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={`Điểm: ${score.correct}/${score.total}`}
                  size="small"
                  color="primary"
                  variant="filled"
                />
                <Chip 
                  label={getDifficultyLabel(currentQuestion.difficulty)}
                  size="small"
                  sx={{ 
                    backgroundColor: `${getDifficultyColor(currentQuestion.difficulty)}20`,
                    color: getDifficultyColor(currentQuestion.difficulty),
                    fontWeight: 'medium'
                  }}
                />
                <IconButton 
                  onClick={toggleBookmark}
                  sx={{ color: isBookmarked ? '#f57c00' : 'text.secondary' }}
                >
                  {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Stack>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #0d47a1, #1976d2)',
                }
              }} 
            />
          </Box>
        </Box>

        {/* Main Content Card */}
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Audio Section */}
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                🎵 Nghe câu hỏi
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mb: 3 }}>
                <Tooltip title="Phát âm" arrow>
                  <IconButton 
                    onClick={handlePlayAudio}
                    sx={{ 
                      backgroundColor: isPlaying ? 'secondary.main' : 'primary.main',
                      color: 'white',
                      width: 72,
                      height: 72,
                      border: '3px solid',
                      borderColor: isPlaying ? 'secondary.light' : 'primary.light',
                      '&:hover': {
                        backgroundColor: isPlaying ? 'secondary.dark' : 'primary.dark',
                        transform: 'scale(1.1)',
                        boxShadow: 4,
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    {isPlaying ? <Pause sx={{ fontSize: 32 }} /> : <VolumeUp sx={{ fontSize: 32 }} />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Lặp lại" arrow>
                  <IconButton 
                    onClick={handlePlayAudio}
                    sx={{ 
                      backgroundColor: 'grey.100',
                      width: 48,
                      height: 48,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                        transform: 'rotate(360deg)',
                      },
                      transition: 'all 0.5s ease-in-out'
                    }}
                  >
                    <Repeat />
                  </IconButton>
                </Tooltip>

                <Tooltip title={`Tốc độ: ${playbackSpeed}x`} arrow>
                  <Button
                    variant="outlined"
                    onClick={handleSpeedChange}
                    size="small"
                    sx={{ 
                      minWidth: 60,
                      borderRadius: 20,
                      fontWeight: 'bold'
                    }}
                  >
                    {playbackSpeed}x
                  </Button>
                </Tooltip>
              </Box>

              {/* Audio Progress */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                  {isPlaying ? '🎵 Đang phát...' : '⏸️ Nhấn play để nghe'}
                </Typography>
                
                <LinearProgress 
                  variant="determinate" 
                  value={isPlaying ? audioProgress : 0} 
                  sx={{ 
                    width: '100%',
                    maxWidth: 300, 
                    mx: 'auto', 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    display: 'block',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'primary.main',
                      borderRadius: 3,
                    }
                  }} 
                />
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip label="HD Audio" size="small" color="primary" variant="outlined" />
                <Chip label="Native Speaker" size="small" color="secondary" variant="outlined" />
              </Stack>
            </Paper>

            {/* Question Section */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3,
                backgroundColor: 'white',
                border: '2px solid',
                borderColor: 'primary.light',
                position: 'relative'
              }}
            >
              <Typography variant="h5" component="div" gutterBottom sx={{ 
                fontWeight: 500, 
                color: 'primary.main',
                lineHeight: 1.4,
                mb: 3,
                textAlign: 'center'
              }}>
                🎧 Nghe và chọn đáp án đúng nhất
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ 
                textAlign: 'center', 
                mb: 3,
                fontStyle: 'italic'
              }}>
                Trong phần thi thực tế, bạn chỉ nghe câu hỏi và 3 đáp án mà không thấy text
              </Typography>

              {/* Show Question Button - Only show before submitting or after result */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Button
                  variant={showTranslation ? 'contained' : 'outlined'}
                  onClick={toggleTranslation}
                  size="medium"
                  color="secondary"
                  sx={{ borderRadius: 20, minWidth: 150 }}
                  disabled={!showResult && selectedAnswer === null}
                >
                  {showTranslation ? 'Ẩn câu hỏi' : 'Hiện câu hỏi'}
                </Button>
              </Box>

              {/* Question Text - Only shown when requested or after result */}
              <Collapse in={showTranslation || showResult}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    mb: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: 'primary.light'
                  }}
                >
                  <Typography variant="body2" color="primary.main" sx={{ 
                    mb: 2, 
                    textAlign: 'center', 
                    fontWeight: 'bold' 
                  }}>
                    📝 Nội dung câu hỏi (chỉ để tham khảo)
                  </Typography>
                  
                  <Typography variant="h6" component="div" sx={{ 
                    fontWeight: 500, 
                    color: 'text.primary',
                    lineHeight: 1.4,
                    mb: 2,
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    {`"${currentQuestion.question}"`}
                  </Typography>

                  <Typography variant="body2" sx={{ 
                    color: 'secondary.main', 
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    🇻🇳 {currentQuestion.questionVietnamese}
                  </Typography>
                </Paper>
              </Collapse>

              {/* Tags */}
              {(showTranslation || showResult) && (
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  {currentQuestion.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '11px' }}
                    />
                  ))}
                </Stack>
              )}
            </Paper>

            {/* Answer Options */}
            <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                🎯 Chọn câu trả lời đúng nhất
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontStyle: 'italic'
              }}>
                Nghe 3 lựa chọn A, B, C và chọn câu trả lời phù hợp nhất
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value as 'a' | 'b' | 'c')}
                >
                  {(['a', 'b', 'c'] as const).map((option) => (
                    <Paper
                      key={option}
                      elevation={selectedAnswer === option ? 3 : 1}
                      sx={{
                        mb: 2,
                        p: 3,
                        borderRadius: 3,
                        border: `2px solid ${getAnswerColor(option)}`,
                        backgroundColor: selectedAnswer === option ? `${getAnswerColor(option)}10` : 'white',
                        transition: 'all 0.3s ease-in-out',
                        cursor: showResult ? 'default' : 'pointer',
                        '&:hover': showResult ? {} : {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => !showResult && handleAnswerSelect(option)}
                    >
                      <FormControlLabel
                        value={option}
                        control={
                          <Radio
                            sx={{
                              color: getAnswerColor(option),
                              '&.Mui-checked': {
                                color: getAnswerColor(option),
                              },
                            }}
                            disabled={showResult}
                          />
                        }
                        label={
                          <Box sx={{ width: '100%' }}>
                            {/* Always show option letter */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="h5" sx={{ 
                                fontWeight: 'bold',
                                color: selectedAnswer === option ? getAnswerColor(option) : 'text.primary'
                              }}>
                                {option.toUpperCase()}
                                {!showResult && (
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    (Nghe để biết nội dung)
                                  </Typography>
                                )}
                              </Typography>
                              {getAnswerIcon(option)}
                            </Box>
                            
                            {/* Show answer text only after submitting */}
                            {showResult && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                  {currentQuestion.options[option]}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  🇻🇳 {currentQuestion.optionsVietnamese[option]}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        sx={{ 
                          margin: 0, 
                          width: '100%',
                          '& .MuiFormControlLabel-label': {
                            width: '100%'
                          }
                        }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>

              {/* Submit Button */}
              {!showResult && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    sx={{ 
                      minWidth: 200,
                      borderRadius: 25,
                      fontWeight: 'bold'
                    }}
                  >
                    Kiểm tra đáp án
                  </Button>
                </Box>
              )}

              {/* Result and Explanation */}
              {showResult && (
                <Fade in={showResult}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      mt: 4, 
                      p: 3, 
                      borderRadius: 3,
                      backgroundColor: selectedAnswer === currentQuestion.correctAnswer ? '#e8f5e8' : '#ffebee',
                      border: `2px solid ${selectedAnswer === currentQuestion.correctAnswer ? '#4caf50' : '#f44336'}`
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          🎉 Chính xác! Bạn đã chọn đúng!
                        </Typography>
                      ) : (
                        <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
                          😔 Chưa đúng. Đáp án đúng là {currentQuestion.correctAnswer.toUpperCase()}
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                      💡 Giải thích:
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {currentQuestion.explanation}
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Paper>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'primary.main', fontWeight: 600 }}>
            🧭 Điều hướng
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant={currentIndex === 0 ? 'outlined' : 'contained'}
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              size="large"
              sx={{ minWidth: 140, borderRadius: 25 }}
            >
              Câu trước
            </Button>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                onClick={handleBack}
                size="large"
                color="secondary"
                sx={{ borderRadius: 25, fontWeight: 'bold', minWidth: 120 }}
              >
                🏠 Quay lại
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => {
                  setCurrentIndex(Math.floor(Math.random() * typeData.data.length));
                  resetQuestionState();
                }}
                size="large"
                sx={{ borderRadius: 25, minWidth: 120 }}
              >
                🎲 Ngẫu nhiên
              </Button>
            </Stack>

            <Button
              variant={currentIndex === typeData.data.length - 1 ? 'outlined' : 'contained'}
              endIcon={<NavigateNext />}
              onClick={handleNext}
              disabled={currentIndex === typeData.data.length - 1}
              size="large"
              sx={{ minWidth: 140, borderRadius: 25 }}
            >
              Câu tiếp
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Câu hỏi {currentIndex + 1} / {typeData.data.length}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Chip 
                label={`Còn lại: ${typeData.data.length - currentIndex - 1}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`Tiến độ: ${Math.round(((currentIndex + 1) / typeData.data.length) * 100)}%`} 
                size="small" 
                color="success" 
                variant="filled" 
              />
            </Stack>
          </Box>
        </Paper>

        {/* Study Tips */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, #fff3e0 0%, #fafafa 100%)',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'warning.light'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ 
            color: 'warning.dark', 
            fontWeight: 600,
            mb: 3,
            textAlign: 'center'
          }}>
            💡 Mẹo làm bài Part 2 (Chỉ nghe - Không đọc)
          </Typography>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>1</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Tập trung nghe từ đầu:</strong> Từ khóa đầu tiên (What, Who, Where...) quyết định loại câu trả lời
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>2</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Nghe tất cả 3 đáp án:</strong> Không chọn vội, so sánh cả A, B, C trước khi quyết định
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>3</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Loại trừ nhanh:</strong> Bỏ những đáp án không liên quan về thời gian, địa điểm, người...
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>4</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Không đoán mò:</strong> Chọn đáp án phù hợp nhất về logic, không chọn random
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>5</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Phản xạ nhanh:</strong> Thời gian ngắn, quyết định nhanh dựa trên những gì vừa nghe
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'warning.main',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.5
                  }}>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>6</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    <strong>Luyện tập thường xuyên:</strong> Càng nghe nhiều càng quen với giọng điệu và tốc độ nói
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: 'warning.light' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="warning.dark" sx={{ mb: 2, fontWeight: 'bold' }}>
              ⚠️ <strong>Lưu ý quan trọng:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Trong thi thực tế, bạn <strong>KHÔNG</strong> thấy câu hỏi và đáp án. Chỉ nghe và chọn A, B, hoặc C.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🎯 <strong>Mục tiêu:</strong> Đạt 85% trở lên để tự tin trong phần thi thực tế
            </Typography>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
