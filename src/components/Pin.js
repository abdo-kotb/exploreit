import React, { useState } from 'react';
import { client, urlFor } from '../client';
import { v4 as uuidv4 } from 'uuid';
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Link,
  Menu,
  MenuItem,
  styled,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DeleteIcon from '@mui/icons-material/Delete';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const PinButton = styled(IconButton)`
  background-color: #fff;
  opacity: 0.75;
  :hover {
    opacity: 1;
    background-color: #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -4px rgba(0, 0, 0, 0.1);
    color: #000;
  }
  color: #000;
`;

const Pin = ({ pin, setPins }) => {
  const [postHover, setPostHover] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const mobile = useMediaQuery('(max-width: 599px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user =
    localStorage.getItem('user') !== undefined
      ? JSON.parse(localStorage.getItem('user'))
      : localStorage.clear();

  const [saved, setSaved] = useState(
    !!pin?.save?.filter(item => item.postedBy?._id === user?.id)?.length
  );

  const [saveCount, setSaveCount] = useState(pin?.save?.length ?? 0);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const savePin = id => {
    setSavingPost(true);
    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [
        {
          _key: uuidv4(),
          userId: user?.id,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.id,
          },
        },
      ])
      .commit()
      .then(() => {
        setSaved(true);
        setSaveCount(prev => prev + 1);
        setSavingPost(false);
      });
  };
  const unsavePin = id => {
    const pinKey = pin.save.filter(item => item.postedBy?._id === user?.id)[0]
      ?._key;
    if (!pinKey) return;

    setSavingPost(true);
    client
      .patch(id)
      .setIfMissing({ save: [] })
      .unset([`save[_key=="${pinKey}"]`])
      .commit()
      .then(() => {
        setSaved(false);
        setSaveCount(prev => prev - 1);
        setSavingPost(false);
      });
  };

  const deletePin = id =>
    client
      .delete(id)
      .then(() => setPins(prevPins => prevPins.filter(pin => pin._id !== id)));

  return (
    <Box
      mx={0.5}
      mb={3}
      sx={{
        bgcolor: 'background.default',
        mx: 0.5,
        mb: 2,
        pb: 1,
        borderRadius: 6,
        boxShadow: 3,
      }}
    >
      <Box
        onMouseEnter={() => setPostHover(true)}
        onMouseLeave={() => setPostHover(false)}
        onClick={() => navigate(`/pin-detail/${pin?._id}`)}
        sx={{
          position: 'relative',
          cursor: 'zoom-in',
          width: 'auto',
          borderRadius: 6,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: 'hidden',
          transitionProperty: 'all',
          transitionDuration: '500ms',
          transitionTimingFunction: theme => theme.transitions.easing.easeInOut,
        }}
      >
        <img
          src={urlFor(pin?.image)?.width(350)}
          loading="lazy"
          alt="user-post"
          style={{ width: '100%' }}
        />
        {postHover && !mobile && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              width: 1,
              height: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              py: 0.5,
              pl: 0.25,
              pr: 0.5,
              zIndex: 50,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                <Link
                  href={`${pin?.image?.asset?.url}?dl=`}
                  download
                  onClick={e => e.stopPropagation()}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.default',
                    opacity: 0.75,
                    '&:hover': {
                      opacity: 1,
                      boxShadow:
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <DownloadForOfflineIcon
                    sx={{ color: '#000', fontSize: 30 }}
                  />
                </Link>
              </Box>
              {saved ? (
                <PinButton
                  onClick={e => {
                    e.stopPropagation();
                    unsavePin(pin?._id);
                  }}
                  variant="contained"
                  sx={{ cursor: 'auto' }}
                >
                  <Badge badgeContent={saveCount} color="primary">
                    {savingPost ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <FavoriteIcon />
                    )}
                  </Badge>
                </PinButton>
              ) : (
                <PinButton
                  onClick={e => {
                    e.stopPropagation();
                    savePin(pin?._id);
                  }}
                  variant="contained"
                >
                  <Badge badgeContent={saveCount} color="primary">
                    {savingPost ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </Badge>
                </PinButton>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 0.5,
                width: 1,
                mb: 1,
              }}
            >
              {pin?.destination && (
                <a
                  href={
                    pin?.destination.startsWith('http')
                      ? pin.destination
                      : `https://${pin.destination}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="destination-link"
                  onClick={e => e.stopPropagation()}
                >
                  <ShortcutIcon />
                  {pin.destination.length > 20
                    ? `${pin.destination.slice(8, 20)}...`
                    : pin.destination}
                </a>
              )}
              {pin?.postedBy?._id === user?.id && (
                <PinButton
                  aria-label="delete"
                  onClick={e => {
                    e.stopPropagation();
                    deletePin(pin._id);
                  }}
                  sx={{
                    bgcolor: 'background.default',
                    opacity: 0.75,
                    ':hover': {
                      opacity: 1,
                      bgcolor: 'background.default',
                      boxShadow:
                        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      color: '#000',
                    },
                    color: '#000',
                  }}
                >
                  <DeleteIcon />
                </PinButton>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <RouterLink
          to={`user-profile/${pin?.postedBy?._id}`}
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.5rem',
            padding: '0 0.5rem',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Avatar alt="user" src={pin?.postedBy?.image} />
          <Typography
            paragraph
            sx={{
              fontWeight: '600',
              fontStyle: 'capitalize',
              m: 0,
              fontSize: '0.8rem',
            }}
          >
            {pin?.postedBy?.userName?.split(' ')[0]}
          </Typography>
        </RouterLink>
        {mobile && (
          <>
            <PinButton
              id="ellipsis-button"
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </PinButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'button',
              }}
            >
              <MenuItem
                onClick={() => {
                  saved ? unsavePin(pin?._id) : savePin(pin?._id);
                  handleClose();
                }}
              >
                {saved ? (
                  <>
                    <FavoriteBorderIcon sx={{ mr: 1 }} />
                    <p>Save Pin</p>
                  </>
                ) : (
                  <>
                    <FavoriteIcon sx={{ mr: 1 }} />
                    <p>Unsave pin</p>
                  </>
                )}
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link
                  href={`${pin?.image?.asset?.url}?dl=`}
                  download
                  sx={{
                    color: 'inherit',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <DownloadForOfflineIcon />
                  <p>Download Pin</p>
                </Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  deletePin(pin?._id);
                  handleClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon sx={{ mr: 1 }} />
                Delete pin
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Pin;
