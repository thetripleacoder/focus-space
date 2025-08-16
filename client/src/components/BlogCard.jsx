import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, TextField, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import { likeBlog, deleteBlog, addCommentBlog } from '../reducers/blogsReducer';
import { showNotification } from '../reducers/notificationReducer';
import { useField } from '../hooks';
import Toggleable from './Toggleable';

const BlogCard = ({ selectedBlog }) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const comment = useField('text');
  const commentToggleRef = useRef();
  const commentsEndRef = useRef(null);
  const user = useSelector((state) => state.user?.loggedUser ?? {});
  const [isSending, setIsSending] = useState(false);
  const [showComments, setShowComments] = useState(false);

  if (!selectedBlog) {
    return <div className='text-center text-gray-500'>Loading...</div>;
  }

  const handleLikeBlog = () => {
    dispatch(likeBlog(selectedBlog));
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

  const handleRemoveBlog = () => {
    if (
      window.confirm(
        `Remove blog "${selectedBlog.title}" by ${selectedBlog.user.name}?`
      )
    ) {
      dispatch(deleteBlog(selectedBlog.id));

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `You deleted "${selectedBlog.title}"`,
          },
          5
        )
      );
    }
  };

  const handleAddCommentBlog = async () => {
    const newComment = comment?.inputProps?.value?.trim();
    if (!newComment || !user.id) return;

    setIsSending(true);

    await dispatch(addCommentBlog(selectedBlog, newComment, user));
    comment.reset();
    dispatch(
      showNotification(
        {
          type: 'success',
          content: `You commented on "${selectedBlog.title}"`,
        },
        5
      )
    );

    setIsSending(false);
    commentToggleRef.current?.toggleVisibility();

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className='max-w-2xl mx-auto mt-6  rounded-2xl shadow-md border border-gray-500 hover:shadow-lg transition-all'>
      {/* Blog Header */}
      <div className='px-6 py-4  flex justify-between'>
        <div>
          <h2 className='text-xl font-bold text-gray-900 hover:text-blue-600 transition'>
            <Link to={`/blogs/${selectedBlog.id}`}>{selectedBlog.title}</Link>
          </h2>

          <p className='flex gap-1 text-sm text-gray-500'>
            <span>
              Posted by{' '}
              <Link
                to={`/users/${selectedBlog.user.id}`}
                className='hover:underline'
              >
                {selectedBlog.user.username}
              </Link>
            </span>
            <span>
              on{' '}
              {selectedBlog.createdAt &&
                new Date(selectedBlog.createdAt).toUTCString()}
            </span>
          </p>
        </div>
        <div>
          {selectedBlog?.isAddedByUser && (
            <IconButton
              onClick={handleRemoveBlog}
              color='error'
              size='small'
              data-testid='remove-button'
              className='mb-2'
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      </div>
      <div className='px-5 flex  gap-2 flex-wrap'>
        {selectedBlog.genres.map((genre) => (
          <span
            key={genre}
            className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1'
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Blog Actions */}
      <div className='px-6 pt-4'>
        <div className=' flex items-center'>
          <span className='font-semibold text-blue-600'></span>
          <IconButton
            onClick={handleLikeBlog}
            color='primary'
            size='small'
            data-testid='like-button'
          >
            <FavoriteIcon />
            <span className='ml-2'>{selectedBlog.likes}</span>
          </IconButton>
          <IconButton
            onClick={() => commentToggleRef.current?.toggleVisibility()}
            color='success'
            size='small'
            data-testid='toggle-comment-button'
          >
            <ChatBubbleIcon />
            <span className='ml-2'> {selectedBlog.comments?.length || 0}</span>
          </IconButton>
        </div>

        {/* Toggleable Comment Input */}
        <Toggleable ref={commentToggleRef}>
          <div className='flex items-center gap-2 w-full'>
            <TextField
              placeholder='Write a comment...'
              size='small'
              fullWidth
              {...comment.inputProps}
              InputProps={{
                style: {
                  borderRadius: '999px',
                  backgroundColor: '#f9fafb',
                },
              }}
            />
            <IconButton
              onClick={handleAddCommentBlog}
              color='success'
              size='medium'
              data-testid='add-comment-button'
              className='!bg-green-500 hover:!bg-green-600 !text-white !rounded-full shadow-sm'
              disabled={!comment?.inputProps?.value?.trim() || isSending}
            >
              {isSending ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </div>
        </Toggleable>

        {/* Comments Section */}
        <div className='pb-6'>
          <div className='flex items-center mb-3'>
            <h3 className='text-base font-semibold text-gray-800'>
              Comments ({selectedBlog.comments.length})
            </h3>
            <IconButton
              onClick={() => setShowComments((prev) => !prev)}
              size='small'
              color='primary'
              aria-label='toggle comments'
              className='transition-transform duration-200'
              style={{
                transform: showComments ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </div>

          {showComments && (
            <>
              <div ref={commentsEndRef} />
              {selectedBlog.comments?.length > 0 ? (
                <ul className='space-y-3'>
                  {selectedBlog.comments.map((comment, index) => (
                    <li
                      key={index}
                      className='bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm'
                    >
                      <strong className='text-blue-600'>
                        {comment.author}
                      </strong>
                      : {comment.text}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  selectedBlog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
    likes: PropTypes.number.isRequired,
    isAddedByUser: PropTypes.bool,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        author: PropTypes.string,
        text: PropTypes.string,
        date: PropTypes.string,
      })
    ),
    genres: PropTypes.array.isRequired,
  }),
};

export default BlogCard;
