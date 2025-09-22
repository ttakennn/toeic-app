import { Typography } from '@mui/material';
import React from 'react';
import { PracticeTitle as IPracticeTitle } from '../types/practice.interface';

function PracticeTitle({ title, icon, content }: IPracticeTitle) {
  return (
    <>
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
          gap: 1,
        }}
      >
        {icon}
        {title}
      </Typography>
      {content && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          {content}
        </Typography>
      )}
    </>
  );
}

export default PracticeTitle;
