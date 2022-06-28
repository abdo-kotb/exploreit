import React, { useEffect, useState } from 'react';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

import { Typography } from '@mui/material';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

function Search({ searchTerm }) {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then(data => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then(data => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <Typography
          paragraph
          sx={{ mt: 2.5, textAlign: 'center', fontSize: '1.25rem' }}
        >
          No pins found
        </Typography>
      )}
    </>
  );
}

export default Search;
