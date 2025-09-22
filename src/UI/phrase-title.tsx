import { Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface PhraseTitleProps {
  title: string;
  description: string;
  handleBack: () => void;
}

function PhraseTitle({ title, description, handleBack }: PhraseTitleProps) {
  return (
    <>
      <Button size="small" startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }} variant="outlined">
        Quay lại Part 1
      </Button>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
    </>
  );
}

export default PhraseTitle;
