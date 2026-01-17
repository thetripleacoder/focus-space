import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  TextField,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useRegister } from '../hooks';
import { showNotification } from '../reducers/notificationReducer';
import AvatarPicker from '../components/AvatarPicker';
import PasswordField from './PasswordField';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    avatarSearch: '',
  });

  const [avatarUrl, setAvatarUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        'Username can only contain letters, numbers, and underscores';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Avatar URL validation
    if (avatarUrl && avatarUrl.trim()) {
      try {
        new URL(avatarUrl);
      } catch {
        newErrors.avatarUrl = 'Avatar must be a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleAvatarSelect = (url) => {
    setAvatarUrl(url);
    // Clear any avatar URL errors when selecting from picker
    if (errors.avatarUrl) {
      setErrors((prev) => ({ ...prev, avatarUrl: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      name: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      return;
    }

    try {
      const username = formData.username.trim();
      const name = formData.name.trim();

      await registerMutation.mutateAsync({
        username,
        name,
        password: formData.password,
        avatar: avatarUrl || undefined,
      });

      // Reset form
      setFormData({
        username: '',
        name: '',
        password: '',
        confirmPassword: '',
        avatarSearch: '',
      });
      setAvatarUrl('');
      setErrors({});
      setTouched({});

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `Account created successfully! Welcome, ${username}!`,
          },
          5,
        ),
      );

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different error types from backend
      let errorMessage = 'Failed to create account. Please try again.';

      if (error?.response?.data?.error) {
        const backendError = error.response.data.error;

        if (backendError.type === 'VALIDATION_ERROR') {
          errorMessage = backendError.message;
          // Set field-specific error if available
          if (backendError.field && backendError.field !== 'avatar') {
            setErrors((prev) => ({
              ...prev,
              [backendError.field]: backendError.message,
              submit: '', // Clear submit error when setting field error
            }));
            return; // Don't set submit error
          }
        } else if (backendError.type === 'CONFLICT_ERROR') {
          errorMessage = backendError.message;
        } else if (backendError.type === 'INTERNAL_SERVER_ERROR') {
          errorMessage = 'Server error occurred. Please try again later.';
        }
      }

      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    }
  };

  const isFormValid =
    formData.username.trim().length >= 3 &&
    formData.name.trim().length >= 2 &&
    formData.password.length >= 8 &&
    formData.confirmPassword.length >= 8 &&
    formData.password === formData.confirmPassword &&
    /^[a-zA-Z0-9_]+$/.test(formData.username) &&
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password);

  return (
    <div className='flex items-center justify-center flex-col gap-6 mt-10'>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>
          Create Account
        </h2>

        <AnimatePresence>
          {avatarUrl && (
            <motion.div
              key='avatar-preview'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className='flex items-center justify-center gap-2 mb-4'
            >
              <Avatar
                src={avatarUrl}
                alt='Selected avatar'
                sx={{ width: 56, height: 56 }}
              />
              <span className='text-xs text-gray-500'>Avatar Preview</span>
            </motion.div>
          )}
        </AnimatePresence>

        {errors.submit && (
          <Alert severity='error' className='mb-4'>
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <TextField
              fullWidth
              label='Username'
              variant='outlined'
              type='text'
              value={formData.username}
              onChange={handleChange('username')}
              onBlur={handleBlur('username')}
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
              disabled={registerMutation.isPending}
              InputProps={{
                style: { borderRadius: '12px' },
              }}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label='Full Name'
              variant='outlined'
              type='text'
              value={formData.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              disabled={registerMutation.isPending}
              InputProps={{
                style: { borderRadius: '12px' },
              }}
            />
          </div>

          <div>
            <PasswordField
              label='Password'
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              disabled={registerMutation.isPending}
            />
          </div>

          <div>
            <PasswordField
              label='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={touched.confirmPassword && !!errors.confirmPassword}
              helperText={touched.confirmPassword && errors.confirmPassword}
              disabled={registerMutation.isPending}
            />
          </div>

          {/* Avatar Picker */}
          <div className='space-y-2'>
            <TextField
              fullWidth
              label='Search for Avatar'
              variant='outlined'
              type='text'
              value={formData.avatarSearch}
              onChange={handleChange('avatarSearch')}
              disabled={registerMutation.isPending}
              placeholder='Enter username to search avatars'
              InputProps={{
                style: { borderRadius: '12px' },
              }}
            />

            <div className='space-y-2'>
              <span className='text-sm text-gray-700 block'>
                Choose Avatar:
              </span>
              <AvatarPicker
                username={formData.avatarSearch}
                onSelect={handleAvatarSelect}
              />
              <TextField
                fullWidth
                variant='outlined'
                placeholder='Or paste image URL directly'
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  // Clear avatar URL error when typing
                  if (errors.avatarUrl) {
                    setErrors((prev) => ({ ...prev, avatarUrl: '' }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, avatarUrl: true }));
                  validateForm();
                }}
                error={touched.avatarUrl && !!errors.avatarUrl}
                helperText={touched.avatarUrl && errors.avatarUrl}
                disabled={registerMutation.isPending}
                InputProps={{
                  style: { borderRadius: '12px' },
                }}
              />
            </div>
          </div>

          <Button
            fullWidth
            variant='contained'
            type='submit'
            disabled={!isFormValid || registerMutation.isPending}
            sx={{
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
            startIcon={
              registerMutation.isPending ? (
                <CircularProgress size={20} color='inherit' />
              ) : null
            }
          >
            {registerMutation.isPending
              ? 'Creating Account...'
              : 'Create Account'}
          </Button>
        </form>

        <div className='flex justify-center mt-6 text-sm text-gray-600'>
          <span>Already have an account?&nbsp;</span>
          <Link
            to='/login'
            className='text-blue-600 hover:text-blue-800 font-medium hover:underline'
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
