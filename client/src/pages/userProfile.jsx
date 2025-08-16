import { useSelector } from 'react-redux';
import UserDetails from '../components/userDetails';

const LoggedUserProfile = () => {
  const loggedUser = useSelector((state) => state.user.loggedUser);

  if (!loggedUser) {
    return (
      <div className='text-center mt-10 text-gray-500'>
        You are not logged in.
      </div>
    );
  }

  return loggedUser && <UserDetails user={loggedUser} />;
};

export default LoggedUserProfile;
