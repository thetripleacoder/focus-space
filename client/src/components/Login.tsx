import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { username, password } });
      localStorage.setItem('token', result.data.login);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>Login</h3>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label>
        <input
          type='checkbox'
          checked={showPassword}
          onChange={() => setShowPassword((prev) => !prev)}
        />
        Show Password
      </label>
      <button type='submit' disabled={loading}>
        Login
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  );
};

export default Login;
