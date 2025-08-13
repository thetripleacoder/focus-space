import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer';
import { showNotification } from '../reducers/notificationReducer';
import { Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const BlogForm = ({ toggleRef }) => {
  const [title, setTitle] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState([]);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user.loggedUser);

  const handleAddGenre = (e) => {
    e.preventDefault();
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
    }
    setGenreInput('');
  };

  const handleRemoveGenre = (genreToRemove) => {
    setGenres(genres.filter((g) => g !== genreToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      genres,
    };

    dispatch(createBlog(payload));
    setTitle('');
    setGenres([]);
    setGenreInput('');

    if (toggleRef?.current?.toggleVisibility) {
      toggleRef.current.toggleVisibility();
    }

    dispatch(
      showNotification(
        {
          type: 'success',
          content: `${loggedUser.name} added a new blog`,
        },
        5
      )
    );
  };

  return (
    <div className='max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow-md border border-gray-200'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-semibold text-gray-800 text-center'>
          What&apos;s on your mind, blogger?
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
          fullWidth
          InputProps={{
            style: {
              borderRadius: '999px',
              backgroundColor: '#f9fafb',
            },
          }}
        />

        {/* Genre Tags */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Add Genres
          </label>
          <div className='flex gap-2 flex-wrap mb-2'>
            {genres.map((genre) => (
              <span
                key={genre}
                className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'
              >
                {genre}
                <button
                  type='button'
                  onClick={() => handleRemoveGenre(genre)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className='flex gap-2'>
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
            <Button
              variant='contained'
              onClick={handleAddGenre}
              className='!bg-blue-500 hover:!bg-blue-600 !text-white !rounded-full px-4'
            >
              Add
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-end pt-2'>
          <Button
            variant='contained'
            type='submit'
            className='!bg-blue-500 hover:!bg-blue-600 !text-white !rounded-full px-6 py-2 shadow-md'
          >
            Post Blog
          </Button>
        </div>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  toggleRef: PropTypes.object,
};

export default BlogForm;
