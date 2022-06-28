import { CircularProgress, Box, Typography } from '@mui/material';
import React from 'react';

const Spinner = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
      <Typography paragraph mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Spinner;
