import { useField } from '../hooks';
import { showNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import loginService from '../services/login';
import { loginUser } from '../reducers/userReducer';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
      // console.log('user', user);

      dispatch(loginUser(user)); // Automatically sets token and localStorage

      username.reset();
      password.reset();
      navigate('/'); // Navigate to home after login
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
      // console.log('error', error);
      // console.log(username.inputProps.value, password.inputProps.value);
      dispatch(
        showNotification(
          {
            type: 'error',
            content: 'Wrong credentials!',
          },
          5
        )
      );
    }
  };

  return (
    <div className='flex items-center justify-center flex-col gap-4 mt-10'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2'>
          <div className='flex items-baseline gap-2'>
            <span>Username:</span>

            <TextField
              variant='standard'
              data-testid='title'
              {...username.inputProps}
            />
          </div>
          <div className='flex items-baseline gap-2'>
            <span>Password:</span>
            <TextField
              variant='standard'
              data-testid='author'
              {...password.inputProps}
            />
          </div>
          <div className='mt-4 items-center justify-center flex'>
            <Button variant='outlined' type='submit'>
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
