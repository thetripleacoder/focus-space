import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';

const Profile = () => {
  const { data, loading, error } = useQuery(ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;

  const user = data?.me;

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>👤 Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
