import { useState } from 'react';
import { showNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import { createBlog } from '../reducers/blogsReducer';
import { Button, TextField } from '@mui/material';
import PropTypes from 'prop-types';
// import { initializeUsers } from '../reducers/userReducer';

const BlogForm = ({ toggleRef }) => {
  const [newBlogFormData, setNewBlogFormData] = useState({
    title: '',
    author: '',
    url: '',
  });
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(createBlog(newBlogFormData));
    // dispatch(initializeUsers());
    setNewBlogFormData({ title: '', author: '', url: '' });
    if (toggleRef?.current?.toggleVisibility) {
      toggleRef.current.toggleVisibility();
    }

    dispatch(
      showNotification(
        {
          type: 'success',
          content: `${newBlogFormData.author} added a new blog`,
        },
        5
      )
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlogFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className='w-100 mx-auto p-6 bg-white rounded-md '>
      <h2 className='text-xl font-semibold text-gray-800 mb-4 text-center'>
        Create a New Blog
      </h2>

      <form onSubmit={addBlog} className='space-y-4'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='title' className='text-sm text-gray-700'>
            Title
          </label>
          <TextField
            id='title'
            variant='outlined'
            size='small'
            data-testid='title'
            name='title'
            value={newBlogFormData.title}
            onChange={handleChange}
            className='!bg-white'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='author' className='text-sm text-gray-700'>
            Author
          </label>
          <TextField
            id='author'
            variant='outlined'
            size='small'
            data-testid='author'
            name='author'
            value={newBlogFormData.author}
            onChange={handleChange}
            className='!bg-white'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='url' className='text-sm text-gray-700'>
            URL
          </label>
          <TextField
            id='url'
            variant='outlined'
            size='small'
            data-testid='url'
            name='url'
            value={newBlogFormData.url}
            onChange={handleChange}
            className='!bg-white'
          />
        </div>

        <div className='flex justify-center pt-2'>
          <Button
            variant='contained'
            type='submit'
            className='!bg-blue-500 hover:!bg-blue-600 !text-white'
          >
            Create
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
