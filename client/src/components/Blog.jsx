import { addCommentBlog, deleteBlog, likeBlog } from '../reducers/blogsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../reducers/notificationReducer';
import PropTypes from 'prop-types';
import { useField } from '../hooks';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Blog = ({ selectedBlog }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const comment = useField('text');
  const user = useSelector((state) => state.user?.loggedUser ?? {});

  if (!selectedBlog)
    return <div className='text-center text-gray-500'>Loading...</div>;

  const handleLikeBlog = (blog) => {
    dispatch(likeBlog(blog));
    dispatch(
      showNotification(
        {
          type: 'success',
          content: `You liked "${selectedBlog.title}"`,
        },
        5
      )
    );
  };

  const handleAddCommentBlog = (blog) => {
    const newComment = comment?.inputProps?.value?.trim();
    if (!newComment || !user.id) return;

    dispatch(addCommentBlog(blog, newComment, user));
    comment.reset();
    dispatch(
      showNotification(
        {
          type: 'success',
          content: `You commented on "${blog.title}"`,
        },
        5
      )
    );
  };

  const handleRemoveBlog = () => {
    if (
      window.confirm(
        `Remove blog "${selectedBlog.title}" by ${selectedBlog.author}?`
      )
    ) {
      dispatch(deleteBlog(selectedBlog.id));
      navigate('/');
      dispatch(
        showNotification(
          {
            type: 'success',
            content: `You deleted "${selectedBlog.title}"`,
          },
          5
        )
      );
    } else {
      window.alert("Glad you're keeping it!");
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all'>
      {/* Blog Header */}
      <div className='px-6 py-4 border-b border-gray-100'>
        <h2 className='text-xl font-bold text-gray-900 hover:text-blue-600 transition'>
          <Link to={`/blogs/${selectedBlog.id}`}>{selectedBlog.title}</Link>
        </h2>
        <p className='text-sm text-gray-500'>Posted by {selectedBlog.author}</p>
        <p className='text-xs text-blue-500 mt-1 break-words'>
          {selectedBlog.url}
        </p>
      </div>

      {/* Blog Actions */}
      <div className='px-6 py-4 space-y-4'>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-gray-600'>👍 Likes:</span>
          <span className='font-semibold text-blue-600'>
            {selectedBlog.likes}
          </span>
          <Button
            variant='contained'
            size='small'
            className='!bg-blue-500 hover:!bg-blue-600 !text-white !rounded-full px-4 py-1 text-sm shadow-sm'
            onClick={() => handleLikeBlog(selectedBlog)}
            data-testid='like-button'
          >
            Like
          </Button>
        </div>

        {selectedBlog?.isAddedByUser && (
          <Button
            variant='contained'
            size='small'
            className='!bg-red-500 hover:!bg-red-600 !text-white !rounded-full px-4 py-1 text-sm shadow-sm'
            onClick={handleRemoveBlog}
            data-testid='remove-button'
          >
            🗑️ Remove
          </Button>
        )}

        {/* Comment Input */}
        <div className='space-y-2'>
          <TextField
            placeholder='Write a comment...'
            size='small'
            className='!w-full !bg-white'
            {...comment.inputProps}
            InputProps={{
              style: {
                borderRadius: '999px',
                backgroundColor: '#f9fafb',
              },
            }}
          />
          <Button
            variant='contained'
            size='small'
            className='!bg-green-500 hover:!bg-green-600 !text-white !rounded-full px-4 py-1 text-sm shadow-sm'
            onClick={() => handleAddCommentBlog(selectedBlog)}
            data-testid='add-comment-button'
          >
            💬 Comment
          </Button>
        </div>

        {/* Comments Section */}
        <div className='mt-6'>
          <h3 className='text-base font-semibold text-gray-800 mb-3'>
            Comments
          </h3>
          {selectedBlog.comments?.length > 0 ? (
            <ul className='space-y-3'>
              {selectedBlog.comments.map((comment, index) => (
                <li
                  key={index}
                  className='bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm'
                >
                  <strong className='text-blue-600'>{comment.author}</strong>:{' '}
                  {comment.text}
                  <span className='ml-2 text-xs text-gray-500'>
                    ({new Date(comment.date).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-400 italic'>
              No comments yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  selectedBlog: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    isAddedByUser: PropTypes.bool,
    comments: PropTypes.array,
  }),
};

export default Blog;
