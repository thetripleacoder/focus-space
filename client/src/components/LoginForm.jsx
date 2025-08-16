import { useField } from '../hooks';
import { showNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import loginService from '../services/login';
import { loginUser } from '../reducers/userReducer';
import { Button, TextField } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useField('text');
  const password = useField('password');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username: username.inputProps.value,
        password: password.inputProps.value,
      });

      dispatch(loginUser(user));
      username.reset();
      password.reset();
      navigate('/');

      dispatch(
        showNotification(
          {
            type: 'success',
            content: `${user.username} has successfully logged in`,
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        showNotification({ type: 'error', content: 'Wrong credentials!' }, 5)
      );
    }
  };

  return (
    <div className='flex items-center justify-center flex-col gap-6 mt-10'>
      <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-4'>
        {[
          { label: 'Username', inputProps: username.inputProps },
          { label: 'Password', inputProps: password.inputProps },
        ].map(({ label, inputProps }, i) => (
          <div key={i} className='flex items-center gap-2'>
            <span className='text-sm text-gray-700 w-24'>{label}:</span>
            <TextField variant='standard' {...inputProps} className='flex-1' />
          </div>
        ))}

        <div className='flex justify-center mt-4'>
          <Button
            variant='outlined'
            type='submit'
            className='!rounded-full px-6 py-1'
          >
            Login
          </Button>
        </div>

        <div className='flex justify-center mt-4 text-sm text-gray-500'>
          <span>Don’t have an account?&nbsp;</span>
          <Link to='/register' className='text-blue-500 hover:underline'>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
