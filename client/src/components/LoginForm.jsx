import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Alert, CircularProgress } from '@mui/material';
import { useLogin } from '../hooks';
import { showNotification } from '../reducers/notificationReducer';
import { loginUser } from '../reducers/userReducer';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mark all fields as touched
    setTouched({ username: true, password: true });

    if (!validateForm()) {
      return;
    }

    try {
      const user = await loginMutation.mutateAsync(formData);

      dispatch(loginUser(user));
      setFormData({ username: '', password: '' });
      setErrors({});
      setTouched({});

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `Welcome back, ${user.username}!`,
          },
          5
        )
      );

      navigate('/');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        'Invalid credentials. Please try again.';
      setErrors({ submit: errorMessage });
    }
  };

  const isFormValid =
    formData.username.trim().length >= 3 && formData.password.length >= 6;

  return (
    <div className='flex items-center justify-center flex-col gap-6 mt-10'>
      <div className='w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center mb-6 text-gray-800'>
          Welcome Back
        </h2>

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
              disabled={loginMutation.isPending}
              InputProps={{
                style: { borderRadius: '12px' },
              }}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label='Password'
              variant='outlined'
              type='password'
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              disabled={loginMutation.isPending}
              InputProps={{
                style: { borderRadius: '12px' },
              }}
            />
          </div>

          <Button
            fullWidth
            variant='contained'
            type='submit'
            disabled={!isFormValid || loginMutation.isPending}
            sx={{
              borderRadius: '12px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
            startIcon={
              loginMutation.isPending ? (
                <CircularProgress size={20} color='inherit' />
              ) : null
            }
          >
            {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className='flex justify-center mt-6 text-sm text-gray-600'>
          <span>Don&apos;t have an account?&nbsp;</span>
          <Link
            to='/register'
            className='text-blue-600 hover:text-blue-800 font-medium hover:underline'
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
