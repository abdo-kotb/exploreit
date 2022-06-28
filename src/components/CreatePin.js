import {
  Box,
  Button,
  IconButton,
  Input,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { client } from '../client';
import DeleteIcon from '@mui/icons-material/Delete';
import { categories } from '../utils/data';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const navigate = useNavigate();

  const uploadImage = e => {
    const selectedFile = e.target.files[0];

    if (selectedFile.type.startsWith('image/')) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then(doc => {
          setImageAsset(doc);
          setLoading(false);
        });
    } else setWrongImageType(true);
  };

  const savePin = () => {
    if (!title || !about || !destination || !imageAsset?._id || !category) {
      setFields(true);
      setTimeout(() => setFields(false), 2000);
      return;
    }
    const doc = {
      _type: 'pin',
      title,
      about,
      destination,
      image: {
        _type: 'image',
        asset: {
          _type: 'refrence',
          _ref: imageAsset._id,
        },
      },
      userId: user._id,
      postedBy: {
        _type: 'postedBy',
        _ref: user._id,
      },
      category,
    };
    client.create(doc).then(() => navigate('/'));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: { lg: 4 / 5 },
      }}
    >
      {fields && (
        <Typography paragraph sx={{ fontSize: '1.25rem', color: 'error.dark' }}>
          Please fill in all the fields
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, lg: 4 },
          width: { xs: 1, lg: 4 / 5 },
        }}
      >
        <Box sx={{ bgcolor: 'grey.200', p: 2, display: 'flex', width: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              border: 2,
              borderStyle: 'dotted',
              borderColor: 'grey.300',
              p: 2,
              width: 1,
              height: '20rem',
            }}
          >
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label htmlFor="upload-image">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 1,
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
                    <CloudUploadOutlinedIcon
                      sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}
                    />
                    <Typography paragraph fontSize={'1.125rem'}>
                      Click to upload
                    </Typography>
                  </Box>
                </Box>
                <Input
                  type="file"
                  accept="image/*"
                  id="upload-image"
                  name="upload-image"
                  sx={{ width: 0, height: 0 }}
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <Box sx={{ position: 'relative', height: 1 }}>
                <img
                  src={imageAsset.url}
                  alt="uploaded"
                  style={{ width: '100%', height: '100%' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.75rem',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'background.paper',
                    },
                  }}
                  onClick={() => setImageAsset(null)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
        <Stack
          sx={{
            pl: { lg: 4 },
            mt: 4,
            width: 1,
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Add your title here"
            value={title}
            variant="filled"
            sx={{
              '& label': {
                fontWeight: 'bold',
              },
            }}
            onChange={e => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Tell us what your pin is about"
            value={about}
            onChange={e => setAbout(e.target.value)}
          />
          <TextField
            fullWidth
            label="Add a link"
            value={destination}
            onChange={e => setDestination(e.target.value)}
          />
          <Typography
            paragraph
            sx={{ fontSize: '1.25rem', fontWeight: '600', my: 3 }}
          >
            Choose Pin Category
          </Typography>
          <TextField
            select
            label="Select category"
            onChange={e => setCategory(e.target.value)}
            defaultValue=""
          >
            {categories?.map(category => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            onClick={savePin}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              p: 1,
              borderRadius: '200px',
              width: '6rem',
              color: 'background.paper',
              alignSelf: 'end',
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>Save Pin</Typography>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreatePin;
