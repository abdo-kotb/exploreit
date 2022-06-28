import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { pinDetailQuery, pinDetailMorePinQuery } from '../utils/data';
import { client, urlFor } from '../client';

import Spinner from './Spinner';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  Link as UiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import MasonryLayout from './MasonryLayout';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import ShareIcon from '@mui/icons-material/Share';
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TelegramIcon from '@mui/icons-material/Telegram';
import Comment from './Comment';

function PinDetails({ user }) {
  const [open, setOpen] = useState(false);
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [pinHover, setPinHover] = useState(false);
  const { pinId } = useParams();
  const bottomScrollRef = useRef();
  const topScrollRef = useRef();
  const inputRef = useRef();

  const url = window.location.href;

  useEffect(() => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then(data => {
        setPinDetails(data[0]);
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then(res => setPins(res));
        }
      });
    }

    topScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pinId]);

  useEffect(() => {
    bottomScrollRef?.current?.addEventListener('DOMNodeInserted', event => {
      const { currentTarget: target } = event;
      target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    });
  }, [pinDetails]);

  const addComment = () => {
    inputRef.current.value = '';

    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuid(),
            postedBy: {
              _type: 'postedBy',
              _ref: user?._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setPinDetails(prevDetails => {
            if (prevDetails.comments)
              return {
                ...prevDetails,
                comments: [
                  ...prevDetails.comments,
                  {
                    _key: uuid(),
                    comment,
                    postedBy: {
                      image: user?.image,
                      userName: user.userName,
                      _id: user?._id,
                    },
                  },
                ],
              };
            else
              return {
                ...prevDetails,
                comments: [
                  {
                    _key: uuid(),
                    comment,
                    postedBy: {
                      image: user?.image,
                      userName: user.userName,
                      _id: user?._id,
                    },
                  },
                ],
              };
          });
          setComment(null);
          setAddingComment(false);
        });
    }
  };

  const deleteComment = key => {
    if (!key) return;

    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .unset([`comments[_key=="${key}"]`])
      .commit()
      .then(() => {
        setPinDetails(prevDetails => {
          return {
            ...prevDetails,
            comments: prevDetails.comments.filter(
              comment => comment._key !== key
            ),
          };
        });
      });
  };

  if (!pinDetails) return <Spinner message="Pin is loading..." />;

  return (
    <>
      <Box
        ref={topScrollRef}
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            lg: 'row',
          },
          gap: 4,
          m: 'auto',
          mb: 4,
          bgcolor: 'background.default',
          borderRadius: '32px',
          maxWidth: 1500,
        }}
      >
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          sx={{
            '& > *': {
              bgcolor: 'transparent',
            },
          }}
        >
          <Stack direction="row" spacing={1}>
            <FacebookShareButton url={url}>
              <Avatar sx={{ bgcolor: '#4267B2' }}>
                <FacebookOutlinedIcon fontSize="large" />
              </Avatar>
            </FacebookShareButton>
            <TelegramShareButton url={url}>
              <Avatar sx={{ bgcolor: '#229ED9' }}>
                <TelegramIcon fontSize="large" />
              </Avatar>
            </TelegramShareButton>
            <TwitterShareButton url={url}>
              <Avatar sx={{ bgcolor: '#229ED9' }}>
                <TwitterIcon />
              </Avatar>
            </TwitterShareButton>
          </Stack>
        </Dialog>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: { md: 'start', lg: 'initial' },
            overflow: 'hidden',
            position: 'relative',
            height: 'fit-content',
            maxWidth: { lg: '50%' },
          }}
          onMouseEnter={() => setPinHover(true)}
          onMouseLeave={() => setPinHover(false)}
        >
          <img
            src={pinDetails.image && urlFor(pinDetails.image).url()}
            alt={pinDetails?.title}
            className="pin-detail--img"
          />
          {pinHover && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: 1,
                height: 1,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: 1,
                  justifyContent: 'space-around',
                }}
              >
                <UiLink
                  href={`${pinDetails?.image?.asset?.url}?dl=`}
                  download
                  onClick={e => e.stopPropagation()}
                  sx={{
                    bgcolor: 'background.default',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    ':hover': { opacity: 1 },
                  }}
                >
                  <DownloadForOfflineIcon
                    sx={{ fontSize: 40, color: 'text.primary' }}
                  />
                </UiLink>
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    bgcolor: 'background.default',
                    width: '3rem',
                    height: '3rem',
                    opacity: 0.7,
                    ':hover': { opacity: 1 },
                  }}
                  onClick={() => setOpen(true)}
                >
                  <ShareIcon sx={{ color: 'text.primary' }} />
                </Avatar>
              </Box>
              <UiLink
                href={pinDetails.destination}
                target="_blank"
                rel="nonreferrer"
                className="destination-link"
              >
                <ShortcutIcon />
                {pinDetails.destination.length > 20
                  ? `${pinDetails.destination.slice(8, 40)}...`
                  : pinDetails.destination}
              </UiLink>
            </Box>
          )}
        </Box>
        <Box sx={{ width: 1, p: 1.25, flex: 1, minWidth: { xl: '38.75rem' } }}>
          <div>
            <Typography component="h1" variant="h2" sx={{ fontWeight: 'bold' }}>
              {pinDetails.title}
            </Typography>
            <Typography paragraph mt={1} variant="caption" fontSize={16}>
              {pinDetails.about}
            </Typography>
          </div>
          <RouterLink
            to={`/user-profile/${pinDetails.postedBy?._id}`}
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.25rem',
              alignItems: 'center',
              backgrounColor: '#fff',
              borderRadius: '100px',
              textDecoration: 'none',
            }}
          >
            <img
              src={pinDetails.postedBy?.image}
              alt="user profile"
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Typography
              paragraph
              variant="body1"
              sx={{
                fontWeight: '600',
                fontStyle: 'capitalize',
                color: 'text.primary',
                mb: 0,
              }}
            >
              {pinDetails.postedBy?.userName}
            </Typography>
          </RouterLink>
          <Typography component="h2" variant="h4" mt={6} mb={2}>
            {pinDetails.comments && pinDetails.comments.length} comments
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }} ref={bottomScrollRef}>
            {pinDetails.comments ? (
              pinDetails.comments.map((comment, i) => (
                <Comment
                  index={i}
                  comment={comment}
                  user={user}
                  deleteComment={() => deleteComment(comment._key)}
                />
              ))
            ) : (
              <Typography
                paragraph
                variant="subtitle1"
                sx={{ textAlign: 'center', mt: 3 }}
              >
                Be the first to comment
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 3.5, gap: 0.75 }}>
            <RouterLink
              to={`user-profile/${user?._id}`}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                backgrounColor: '#fff',
                borderRadius: '100px',
              }}
            >
              <img
                src={user?.image}
                alt="user profile"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </RouterLink>
            <TextField
              sx={{ flex: 1, '& div': { borderRadius: 8 } }}
              label="Add a comment"
              variant="outlined"
              onChange={e => setComment(e.target.value)}
              inputRef={inputRef}
            />
            <Button variant="contained" onClick={addComment}>
              {addingComment ? 'posting the comment...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </Box>
      {pins?.length > 0 && (
        <>
          <Typography component="h2" variant="h4" mb={2}>
            Check similar ideas
          </Typography>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
}

export default PinDetails;
