import { useState } from 'react';
import { useField } from '../hooks';
import { showNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import { createUser } from '../reducers/userReducer';
import { Button, TextField, Avatar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarPicker from '../components/AvatarPicker';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useField('text');
  const name = useField('text');
  const password = useField('password');
  const confirmPassword = useField('password');
  const avatarSearch = useField('avatarSearch');

  const [avatarUrl, setAvatarUrl] = useState('');

  const handleAvatarSelect = (url) => {
    setAvatarUrl(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      username.inputProps.value.length < 3 &&
      password.inputProps.value.length < 3
    ) {
      dispatch(
        showNotification(
          { type: 'error', content: 'invalid username and password' },
          5
        )
      );
      return;
    }
    if (username.inputProps.value.length < 3) {
      dispatch(
        showNotification({ type: 'error', content: 'invalid username' }, 5)
      );
      return;
    }
    if (password.inputProps.value.length < 3) {
      dispatch(
        showNotification({ type: 'error', content: 'invalid password' }, 5)
      );
      return;
    }
    if (password.inputProps.value !== confirmPassword.inputProps.value) {
      dispatch(
        showNotification(
          { type: 'error', content: 'passwords do not match' },
          5
        )
      );
      return;
    }

    try {
      await dispatch(
        createUser({
          username: username.inputProps.value,
          name: name.inputProps.value,
          avatar: avatarUrl || undefined,
          password: password.inputProps.value,
        })
      );

      username.reset();
      name.reset();
      password.reset();
      confirmPassword.reset();
      setAvatarUrl('');

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `Account created for ${username.inputProps.value}`,
          },
          5
        )
      );

      navigate('/login');
    } catch (error) {
      dispatch(
        showNotification({ type: 'error', content: 'User creation failed' }, 5)
      );
    }
  };

  return (
    <div className='flex items-center justify-center flex-col gap-6 mt-10'>
      <AnimatePresence>
        {avatarUrl && (
          <motion.div
            key='avatar-preview'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='flex items-center gap-2 mt-2'
          >
            <Avatar
              src={avatarUrl}
              alt='Selected avatar'
              sx={{ width: 56, height: 56 }}
            />
            <span className='text-xs text-gray-500'>Preview</span>
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-4'>
        {[
          { label: 'Username', hook: username },
          { label: 'Name', hook: name },
          { label: 'Password', hook: password },
          { label: 'Confirm Password', hook: confirmPassword },
          { label: 'Search Avatar', hook: avatarSearch },
        ].map(({ label, hook }, i) => (
          <div key={i} className='flex items-center gap-2'>
            <span className='text-sm text-gray-700 w-32'>{label}:</span>
            <TextField
              variant='standard'
              {...hook.inputProps}
              className='flex-1'
            />
          </div>
        ))}

        {/* Avatar Picker with Animated Preview */}
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-gray-700'>Avatar:</span>
          <AvatarPicker
            username={avatarSearch.inputProps.value}
            onSelect={handleAvatarSelect}
          />
          <TextField
            variant='standard'
            placeholder='Or paste image URL'
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            fullWidth
          />
        </div>

        <div className='flex justify-center mt-4'>
          <Button
            variant='outlined'
            type='submit'
            className='!rounded-full px-6 py-1'
          >
            Register
          </Button>
        </div>

        <div className='flex justify-center mt-4 text-sm text-gray-500'>
          <span>Already have an account?&nbsp;</span>
          <Link to='/login' className='text-blue-500 hover:underline'>
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
