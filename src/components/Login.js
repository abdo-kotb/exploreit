import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { client } from '../client';

import video from '../assets/video.mp4';
import Logo from './Logo';
import { Backdrop, Box } from '@mui/material';

export const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = response => {
    const userObj = jwt_decode(response?.credential);
    const { name, sub: id, picture } = userObj;

    localStorage.setItem('user', JSON.stringify({ name, id, picture }));

    const doc = {
      _id: id,
      _type: 'user',
      userName: name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => navigate('/', { replace: true }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <video
          src={video}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Backdrop
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
          }}
          open
        >
          <Logo />
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={responseGoogle}
            state_cookie_domain="single_host_origin"
          />
        </Backdrop>
      </Box>
    </Box>
  );
};

export default Login;
