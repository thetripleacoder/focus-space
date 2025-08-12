import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';
import RegisterForm from '../components/RegisterForm';
import Login from '../components/Login';
import Layout from '../components/Layout';

const Profile = () => {
  const { data, loading, error } = useQuery(ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile</p>;

  const user = data?.me;

  return (
    <Layout>
      <div className='max-w-md mx-auto px-4 py-6'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
          👤 Profile
        </h2>

        {user ? (
          <div className='bg-white shadow rounded-lg p-4 space-y-2'>
            <p>
              <span className='font-medium text-gray-700'>ID:</span> {user.id}
            </p>
            <p>
              <span className='font-medium text-gray-700'>Username:</span>{' '}
              {user.username}
            </p>
            <p>
              <span className='font-medium text-gray-700'>Password:</span>{' '}
              {user.password}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            <p className='text-gray-600'>You are not logged in.</p>
            <Login />
            <RegisterForm />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
