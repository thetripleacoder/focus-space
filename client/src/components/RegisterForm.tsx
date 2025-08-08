import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/mutations';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [register, { loading, error }] = useMutation(REGISTER);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ variables: { username, password } });
      alert('Registered successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Register</h3>
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
        Register
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  );
};

export default RegisterForm;
