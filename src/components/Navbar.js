import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Navbar({ searchTerm, setSearchTerm, user }) {
  const navigate = useNavigate();

  if (!user) return;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.5, md: 1.25 },
        width: 1,
        py: 1.75,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          width: 1,
        }}
      >
        <TextField
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => navigate('/search')}
          sx={{
            m: 0.5,
            width: 1,
            bgcolor: 'background.default',
            '&, & div': { borderRadius: 8 },
          }}
          variant="outlined"
          label={<SearchIcon />}
          placeholder="Search..."
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Link to={`user-profile/${user?._id}`} className="user-img">
          <Avatar src={user?.image} alt="user" />
        </Link>
        <Link
          to={'create-pin'}
          style={{
            backgroundColor: '#6b4ce7',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <AddIcon color="#fff" />
        </Link>
      </Box>
    </Box>
  );
}
