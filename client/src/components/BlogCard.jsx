import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, TextField, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import {
  useUpdateBlog,
  useDeleteBlog,
  useLikeBlog,
  useAddComment,
} from '../hooks';
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
  const [showComments, setShowComments] = useState(false);

  // React Query hooks
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const likeBlogMutation = useLikeBlog();
  const addCommentMutation = useAddComment();

  // New: edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(selectedBlog?.title || '');
  const [editGenres, setEditGenres] = useState(
    selectedBlog?.genres?.join(', ') || ''
  );

  // Update edit state when selectedBlog changes
  useEffect(() => {
    if (selectedBlog && !isEditing) {
      setEditTitle(selectedBlog.title || '');
      setEditGenres(selectedBlog.genres?.join(', ') || '');
    }
  }, [selectedBlog, isEditing]);

  if (!selectedBlog) {
    return <div className='text-center text-gray-500'>Loading...</div>;
  }

  const handleLikeBlog = async () => {
    try {
      await likeBlogMutation.mutateAsync({ blogId: selectedBlog.id });
      dispatch(
        showNotification(
          {
            type: 'success',
            content: `You liked "${selectedBlog.title}"`,
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        showNotification(
          {
            type: 'error',
            content: `Failed to like blog: ${error.message || 'Unknown error'}`,
          },
          5
        )
      );
    }
  };

  const handleRemoveBlog = async () => {
    if (
      window.confirm(
        `Remove blog "${selectedBlog.title}" by ${selectedBlog.user.name}?`
      )
    ) {
      try {
        await deleteBlogMutation.mutateAsync(selectedBlog.id);
        dispatch(
          showNotification(
            {
              type: 'success',
              content: `You deleted "${selectedBlog.title}"`,
            },
            5
          )
        );
      } catch (error) {
        dispatch(
          showNotification(
            {
              type: 'error',
              content: `Failed to delete blog: ${
                error.message || 'Unknown error'
              }`,
            },
            5
          )
        );
      }
    }
  };

  const handleAddCommentBlog = async () => {
    const newComment = comment?.inputProps?.value?.trim();
    if (!newComment || !user.id) return;

    try {
      await addCommentMutation.mutateAsync({
        blogId: selectedBlog.id,
        comment: newComment,
      });
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

      commentToggleRef.current?.toggleVisibility();

      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      dispatch(
        showNotification(
          {
            type: 'error',
            content: `Failed to add comment: ${
              error.message || 'Unknown error'
            }`,
          },
          5
        )
      );
    }
  };

  // New: save edits
  const handleSaveEdit = async () => {
    const updatedBlog = {
      title: editTitle.trim(),
      genres: editGenres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
    };

    try {
      await updateBlogMutation.mutateAsync({
        id: selectedBlog.id,
        blog: updatedBlog,
      });
      dispatch(
        showNotification(
          { type: 'success', content: `Blog updated successfully` },
          5
        )
      );
      setIsEditing(false);
    } catch (error) {
      dispatch(
        showNotification(
          {
            type: 'error',
            content: `Failed to update blog: ${
              error.message || 'Unknown error'
            }`,
          },
          5
        )
      );
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-6  rounded-2xl shadow-md border border-gray-500 hover:shadow-lg transition-all'>
      {/* Blog Header */}
      <div className='px-6 py-4 flex justify-between'>
        <div>
          {isEditing ? (
            <div className='flex flex-col gap-2'>
              <TextField
                size='small'
                label='Title'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                fullWidth
                className='mb-2'
              />
              <TextField
                size='small'
                label='Genres (comma separated)'
                value={editGenres}
                onChange={(e) => setEditGenres(e.target.value)}
                fullWidth
              />
            </div>
          ) : (
            <>
              <div className='flex items-center gap-4'>
                <div>
                  {selectedBlog.user.avatar ? (
                    <Link to={`/users/${selectedBlog.user.id}`}>
                      <img
                        src={selectedBlog.user.avatar}
                        alt={`${selectedBlog.user.name}'s avatar`}
                        className='w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity'
                      />
                    </Link>
                  ) : (
                    <Link to={`/users/${selectedBlog.user.id}`}>
                      <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:bg-blue-700 transition-colors'>
                        {selectedBlog.user.name?.charAt(0).toUpperCase() ?? 'U'}
                      </div>
                    </Link>
                  )}
                </div>
                <h2 className='text-xl font-bold text-gray-900 hover:text-blue-600 transition'>
                  <Link to={`/blogs/${selectedBlog.id}`}>
                    {selectedBlog.title}
                  </Link>
                </h2>
              </div>
              <p className='pl-1 pt-2 flex gap-1 text-sm text-gray-500'>
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
            </>
          )}
        </div>
        <div className='flex flex-col items-end gap-1'>
          {selectedBlog?.isAddedByUser && (
            <>
              {isEditing ? (
                <>
                  <IconButton
                    color='success'
                    size='small'
                    onClick={handleSaveEdit}
                    disabled={updateBlogMutation.isPending}
                  >
                    {updateBlogMutation.isPending ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <SaveIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color='inherit'
                    size='small'
                    onClick={() => setIsEditing(false)}
                  >
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    color='primary'
                    size='small'
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleRemoveBlog}
                    color='error'
                    size='small'
                    disabled={deleteBlogMutation.isPending}
                  >
                    {deleteBlogMutation.isPending ? (
                      <CircularProgress size={16} color='inherit' />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Genres display */}
      {!isEditing && (
        <div className='px-5 flex gap-2 flex-wrap'>
          {selectedBlog.genres.map((genre) => (
            <span
              key={genre}
              className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm'
            >
              {genre}
            </span>
          ))}
        </div>
      )}
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
              disabled={
                !comment?.inputProps?.value?.trim() ||
                addCommentMutation.isPending
              }
            >
              {addCommentMutation.isPending ? (
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
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      avatar: PropTypes.string,
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
