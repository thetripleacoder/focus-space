import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer';
import { showNotification } from '../reducers/notificationReducer';
import { TextField, IconButton, Tooltip, Fab } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const BlogForm = ({ toggleRef }) => {
  const [title, setTitle] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState([]);
  const [titleTouched, setTitleTouched] = useState(false);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.loggedUser);

  const handleAddGenre = (e) => {
    e.preventDefault();
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter((g) => g !== genreToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleTouched(true);

    if (!title.trim() || genres.length === 0) return;

    const payload = {
      title: title.trim(),
      genres,
    };

    try {
      await dispatch(createBlog(payload));
      setTitle('');
      setGenres([]);
      setGenreInput('');
      setTitleTouched(false);

      toggleRef?.current?.toggleVisibility?.();

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `${loggedUser.name} added a new blog`,
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        showNotification(
          {
            type: 'error',
            content: `Failed to post blog: ${
              error.message || 'Something went wrong'
            }`,
          },
          5
        )
      );
    }
  };

  const isSubmitDisabled = !title.trim() || genres.length === 0;

  return (
    <div className='max-w-2xl mx-auto mt-6 '>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-semibold text-gray-800 text-center'>
          What&apos;s on your mind, {loggedUser.username}?
        </h2>
      </div>

      <form onSubmit={handleSubmit} className='px-6 py-4 space-y-6'>
        {/* Blog Title */}
        <TextField
          id='title'
          name='title'
          variant='outlined'
          size='medium'
          placeholder='Write a blog title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitleTouched(true)}
          fullWidth
          error={titleTouched && !title.trim()}
          helperText={
            titleTouched && !title.trim() ? 'Title is required to post' : ''
          }
          InputProps={{
            style: {
              borderRadius: '999px',
              backgroundColor: '#f9fafb',
            },
          }}
        />

        {/* Genre Tags */}

        <div className='mt-4 mb-2 flex gap-2 items-center'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Tags:
          </label>
          <TextField
            id='genreInput'
            name='genreInput'
            variant='outlined'
            size='small'
            placeholder='Type a genre and press Enter'
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddGenre(e);
            }}
            fullWidth
            InputProps={{
              style: {
                borderRadius: '999px',
                backgroundColor: '#f9fafb',
              },
            }}
          />
          <Tooltip title='Add Genre'>
            <IconButton
              onClick={handleAddGenre}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '999px',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className='px-10 flex justify-center gap-2 flex-wrap mb-2'>
          {genres.map((genre) => (
            <span
              key={genre}
              className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1'
            >
              {genre}
              <IconButton
                size='small'
                onClick={() => handleRemoveGenre(genre)}
                sx={{ color: 'primary.main', padding: 0.5 }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </span>
          ))}
        </div>

        {/* Submit FAB */}
        <div className='mt-4 flex justify-center'>
          <Tooltip
            title={
              isSubmitDisabled
                ? 'Enter a title and at least one genre to post'
                : 'Post Blog'
            }
          >
            <span>
              <Fab
                variant='extended'
                type='submit'
                color='primary'
                disabled={isSubmitDisabled}
                sx={{
                  borderRadius: '999px',
                  boxShadow: 3,
                  opacity: isSubmitDisabled ? 0.6 : 1,
                  cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                  gap: 1.2,
                  px: 3,
                }}
              >
                <SendIcon />
                <span style={{ fontWeight: 500 }}>Post</span>
              </Fab>
            </span>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  toggleRef: PropTypes.object,
};

export default BlogForm;
