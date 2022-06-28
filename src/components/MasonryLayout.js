import React from 'react';

import Pin from '../components/Pin';
import Masonry from 'react-masonry-css';

const breakpoints = {
  3000: 5,
  2000: 4,
  1200: 3,
  1000: 2,
  500: 1,
  default: 3,
};

const MasonryLayout = ({ pins, setPins }) => {
  return (
    <Masonry
      className=""
      breakpointCols={breakpoints}
      style={{ display: 'flex' }}
    >
      {pins.map(pin => (
        <Pin key={pin._id} pin={pin} setPins={setPins} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
