import React from 'react';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import { Box, Typography } from '@mui/material';

const Logo = ({ color = false }) => {
  return (
    <Box
      sx={{
        p: 1.25,
        display: 'flex',
        alignItems: 'center',
        color: color ? 'primary.main' : '#fff',
        gap: 1,
      }}
    >
      <PhotoCameraBackIcon sx={{ fontSize: '2rem' }} />
      <Typography
        component="h1"
        sx={{
          fontFamily: "'Permanent Marker', cursive",
          fontSize: '2rem',
        }}
      >
        exploreIt
      </Typography>
    </Box>
  );
};

export default Logo;
