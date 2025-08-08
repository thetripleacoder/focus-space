import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOGIN = gql`
  mutation Login($username: String!) {
    login(username: $username)
  }
`;

export default function Login() {
  const [username, setUsername] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const res = await login({ variables: { username } });
      const token = res.data.login;
      localStorage.setItem('token', token);
      window.location.reload(); // refresh to reload auth headers
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>Login failed</p>}
    </div>
  );
}
