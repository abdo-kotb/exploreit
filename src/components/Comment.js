import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const Comment = ({ comment, index, user, deleteComment }) => {
  const [commentHover, setCommentHover] = useState(false);

  return (
    <div key={index}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 1.25,
          alignItems: 'center',
          mb: 1,
        }}
        onMouseEnter={() => setCommentHover(true)}
        onMouseLeave={() => setCommentHover(false)}
      >
        <Link
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
          }}
          to={`/user-profile/${comment.postedBy?._id}`}
        >
          <Avatar src={comment.postedBy?.image} alt="user" />
        </Link>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Link
            to={`/user-profile/${comment.postedBy?._id}`}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <Typography paragraph variant="h6" mb={0}>
              {comment.postedBy?.userName}
            </Typography>
          </Link>
          <Typography paragraph variant="body1" mb={0}>
            {comment.comment}
          </Typography>
        </Box>
        {comment.postedBy?._id === user?._id && commentHover && (
          <IconButton
            sx={{ ml: 'auto', alignSelf: 'start' }}
            onClick={deleteComment}
          >
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
    </div>
  );
};

export default Comment;
