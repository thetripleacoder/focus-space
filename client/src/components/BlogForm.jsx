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
    <div className='max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow-lg border border-gray-200'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h2 className='text-lg font-semibold text-gray-800 text-center'>
          What's on your mind, blogger?
        </h2>
      </div>

      <form onSubmit={addBlog} className='px-6 py-4 space-y-5'>
        {['title', 'author', 'url'].map((field) => (
          <div key={field}>
            <TextField
              id={field}
              name={field}
              variant='outlined'
              size='medium'
              placeholder={`Enter ${field}`}
              value={newBlogFormData[field]}
              onChange={handleChange}
              fullWidth
              InputProps={{
                style: {
                  borderRadius: '999px',
                  backgroundColor: '#f9fafb',
                },
              }}
            />
          </div>
        ))}

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
