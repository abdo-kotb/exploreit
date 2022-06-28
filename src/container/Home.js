import { Box, IconButton } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { userQuery } from '../utils/data';
import { client } from '../client';

import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import Pins from './Pins';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../components/Logo';
import Scrollbars from 'react-custom-scrollbars';

const Home = () => {
  const [user, setUser] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const scrollRef = useRef();

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userInfo =
    localStorage.getItem('user') !== undefined
      ? JSON.parse(localStorage.getItem('user'))
      : localStorage.clear();

  React.useEffect(() => {
    const query = userQuery(userInfo?.id);
    client.fetch(query).then(data => {
      setUser(data[0]);
    });
  }, [userInfo?.id]);

  useEffect(() => scrollRef.current.scrollTo(0, 0), []);

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'grey.50',
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100vh',
        transitionProperty: 'height',
        transitionDuration: '75ms',
        transitionTimingFunction: 'easing.easeOut',
      }}
    >
      <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
        <Box
          sx={{
            p: 0.5,
            px: 2,
            width: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 3,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo color />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="user"
              style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }}
            />
          </Link>
        </Box>
      </Box>

      <Sidebar
        width={drawerWidth}
        drawerToggle={handleDrawerToggle}
        mobile={mobileOpen}
        user={user && user}
      />
      <Scrollbars autoHide>
        <Box
          component="main"
          sx={{
            flex: 1,
            pb: 0.5,
            bgcolor: '#f0edfd',
            minHeight: '100vh',
          }}
          ref={scrollRef}
        >
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/*" element={<Pins user={user && user} />} />
          </Routes>
        </Box>
      </Scrollbars>
    </Box>
  );
};

export default Home;
