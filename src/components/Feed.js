import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

import Typography from '@mui/material/Typography';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  const updatePins = data => setPins(data);

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then(data => {
        updatePins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then(data => {
        updatePins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner message="Your feed is improving" />;

  if (!pins?.length)
    return (
      <Typography
        component="h2"
        variant="h6"
        sx={{ textAlign: 'center', mt: 3 }}
      >
        No pins available at the moment.
      </Typography>
    );

  return (
    <div>{pins && <MasonryLayout pins={pins} setPins={updatePins} />}</div>
  );
}

export default Feed;
