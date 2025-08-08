import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import RegisterForm from '../components/RegisterForm';
import Login from '../components/Login';

const Profile = () => {
  const { data, loading, error } = useQuery(ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;

  const user = data?.me;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>👤 Profile</h2>

      {user ? (
        <>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
            <strong>Password:</strong> {user.password}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Login />
          <RegisterForm />
        </>
      )}
    </div>
  );
};

export default Profile;
