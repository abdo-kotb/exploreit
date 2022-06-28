import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Box from '@mui/material/Box';
import Feed from '../components/Feed';
import Navbar from '../components/Navbar';
import PinDetails from '../components/PinDetails';
import CreatePin from '../components/CreatePin';
import Search from '../components/Search';

function Pins({ user }) {
  const [search, setSearch] = useState('');

  return (
    <Box sx={{ px: { xs: 0.5, md: 1.25 } }}>
      <Navbar searchTerm={search} setSearchTerm={setSearch} user={user} />
      <Box sx={{ minHeight: 1 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={<Search searchTerm={search} setSearchTerm={setSearch} />}
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default Pins;
