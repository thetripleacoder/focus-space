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
    console.log(blog);
    dispatch(likeBlog(blog));
    dispatch(
      showNotification(
        {
          type: 'success',
          content: `You have liked blog with content: ${selectedBlog.title}`,
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
          content: `You added a comment to: ${blog.title}`,
        },
        5
      )
    );
  };

  const handleRemoveBlog = () => {
    if (
      window.confirm(
        `Remove blog ${selectedBlog.title} by ${selectedBlog.author}?`
      )
    ) {
      dispatch(deleteBlog(selectedBlog.id));
      navigate(-1);
      dispatch(
        showNotification(
          {
            type: 'success',
            content: `You have deleted blog with content: ${selectedBlog.title}`,
          },
          5
        )
      );
    } else {
      window.alert("Glad you're staying!");
    }
  };

  return (
    <div className='p-4 border border-gray-300 rounded-md mb-4 shadow-sm bg-white blog'>
      <p className='text-xl font-semibold text-gray-800 blogTitle'>
        <Link to={`/blogs/${selectedBlog.id}`}>{selectedBlog.title}</Link>
      </p>
      <p className='text-sm text-gray-600 mb-2 blogAuthor'>
        Added by {selectedBlog.author}
      </p>

      <div className='blogDetails space-y-4'>
        <p className='text-sm text-blue-600 blogUrl'>URL: {selectedBlog.url}</p>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-700'>Likes:</span>
          <span className='font-medium text-blue-600 blogLikes'>
            {selectedBlog.likes}
          </span>
          <Button
            variant='contained'
            size='small'
            className='!bg-blue-500 hover:!bg-blue-600 !text-white'
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
            className='!bg-red-500 hover:!bg-red-600 !text-white'
            onClick={handleRemoveBlog}
            data-testid='remove-button'
          >
            Remove
          </Button>
        )}

        <div className='space-y-2'>
          <TextField
            placeholder='Add comment'
            size='small'
            className='!w-full'
            {...comment.inputProps}
          />
          <Button
            variant='contained'
            size='small'
            className='!bg-green-500 hover:!bg-green-600 !text-white'
            onClick={() => handleAddCommentBlog(selectedBlog)}
            data-testid='add-comment-button'
          >
            Add Comment
          </Button>
        </div>

        <div className='mt-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Comments:
          </h3>
          {selectedBlog.comments?.length > 0 ? (
            <ul className='space-y-2'>
              {selectedBlog.comments.map((comment, index) => (
                <li key={index} className='text-sm text-gray-700'>
                  <strong className='text-blue-600'>{comment.author}</strong>:{' '}
                  {comment.text}
                  <span className='ml-2 text-xs text-gray-500'>
                    ({new Date(comment.date).toLocaleString()})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-500'>No comments yet.</p>
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
