import React, { useEffect, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate, useParams } from 'react-router-dom';
import { userQuery } from '../utils/data';
import { client } from '../client';
import { userCreatedPinsQuery, userSavedPinsQuery } from '../utils/data';

import Spinner from './Spinner';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MasonryLayout from './MasonryLayout';

const randomImage =
  'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeStyles = {
  bgcolor: 'primary.dark',
  fontWeight: 'bold',
  p: 0.5,
  px: 2,
  ':hover': { bgcolor: 'primary.light' },
  transitionDuration: '300ms',
  color: '#fff',
};
const notActiveStyles = {
  bgcolor: 'primary.light',
  fontWeight: 'bold',
  p: 0.5,
  px: 2,
  ':hover': { bgcolor: 'primary.dark' },
  transitionDuration: '300ms',
  color: '#fff',
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then(data => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    setSwitching(true);
    if (text === 'Created') {
      const query = userCreatedPinsQuery(userId);
      client.fetch(query).then(data => {
        setPins(data);
        setSwitching(false);
      });
    } else {
      const query = userSavedPinsQuery(userId);
      client.fetch(query).then(data => {
        setPins(data);
        setSwitching(false);
      });
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate('/login');
  };

  if (!user) return <Spinner message="Loading profile..." />;

  return (
    <Box
      sx={{
        position: 'relative',
        pb: 0.5,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', pb: 1.25 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            mb: 1.75,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={randomImage}
              style={{ width: '100%', height: '370px', objectFit: 'cover' }}
              alt="banner"
            />
            <img
              style={{
                borderRadius: '50%',
                width: '5rem',
                height: '5rem',
                marginTop: '-2.5rem',
                objectFit: 'cover',
              }}
              src={user.image}
              alt="user"
            />
            <Typography
              component="h1"
              variant="h3"
              sx={{ textAlign: 'center', mt: 0.75 }}
            >
              {user.userName}
            </Typography>
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                zIndex: 1,
                right: 10,
                p: 0.5,
              }}
            >
              {userId === user._id && (
                <IconButton
                  sx={{
                    '&, &:hover': {
                      bgcolor: 'background.default',
                    },
                    p: 0.5,
                    borderRadius: '50%',
                  }}
                  onClick={logout}
                >
                  <LogoutIcon size="large" sx={{ color: 'error.main' }} />
                </IconButton>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.75 }}>
            <Button
              onClick={e => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              sx={activeBtn === 'created' ? activeStyles : notActiveStyles}
              style={{
                borderRadius: '1rem 0 0 1rem',
              }}
            >
              Created
            </Button>
            <Button
              onClick={e => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              sx={activeBtn === 'saved' ? activeStyles : notActiveStyles}
              style={{
                borderRadius: '0 1rem 1rem 0',
              }}
            >
              Saved
            </Button>
          </Box>

          {pins?.length ? (
            <Box sx={{ px: 0.5 }}>
              {switching ? <Spinner /> : <MasonryLayout pins={pins} />}
            </Box>
          ) : (
            <Typography
              component="p"
              variant="h5"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 'bold',
                alignItems: 'center',
                width: 1,
                mt: 0.5,
              }}
            >
              No pins found!
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default UserProfile;
