import {
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { TestQuestion } from '@/types/test.interface';
import { PracticeCategory } from '@/types/core.interface';
import { CommonUtil } from '@/utils/common.util';

interface TestFinishDialogProps {
  title: string;
  duration: string;
  answeredCount: number;
  timeLeft: number;
  answers: Record<number, string>;
  testQuestion: TestQuestion[];
  categoryData: PracticeCategory;
  showFinishDialog: boolean;
  setShowFinishDialog: (showFinishDialog: boolean) => void;
  onClickViewResults: () => void;
}

function TestFinishDialog({
  title,
  duration,
  answeredCount,
  timeLeft,
  answers,
  testQuestion,
  categoryData,
  showFinishDialog,
  setShowFinishDialog,
  onClickViewResults,
}: TestFinishDialogProps) {
  return (
    <Dialog
      open={showFinishDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 2, sm: 3 },
          width: { xs: 'calc(100% - 32px)', sm: 'auto' },
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, px: { xs: 2, sm: 3 } }}>
        <CheckCircle sx={{ fontSize: { xs: 50, md: 60 }, color: '#4caf50', mb: 2 }} />
        <Typography
          component="div"
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1.3rem', md: '1.5rem' },
          }}
        >
          Hoàn thành bài test!
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontSize: { xs: '0.9rem', md: '1rem' },
          }}
        >
          Bạn đã hoàn thành <strong>{title}</strong>
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Chip label={`${answeredCount}/${testQuestion.length} câu`} color="primary" size="medium" />
          <Chip
            label={CommonUtil.formatTime(Math.max(0, parseInt(duration.split(' ')[0]) * 60 - timeLeft))}
            color="secondary"
            size="medium"
          />
        </Stack>
        {Object.keys(answers).length < testQuestion.length && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn chưa trả lời hết tất cả câu hỏi!
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
          Kết quả sẽ được hiển thị sau khi xem lại đáp án
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          pb: 3,
          px: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Cancel />}
          onClick={() => setShowFinishDialog(false)}
          size="medium"
          sx={{
            order: { xs: 2, sm: 1 },
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
          }}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={<CheckCircle />}
          size="medium"
          onClick={onClickViewResults}
          sx={{
            backgroundColor: categoryData.color,
            order: { xs: 1, sm: 2 },
            width: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
          }}
        >
          Xem kết quả
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TestFinishDialog;
