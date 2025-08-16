import { useSelector } from 'react-redux';
import UserDetails from '../components/userDetails';
import { useMatch } from 'react-router-dom';
import { useEffect, useState } from 'react';

const OtherUserProfile = () => {
  const selectedUserId = useMatch('/users/:id')?.params.id;
  const [selectedUser, setSelectedUser] = useState({});
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    // console.log('Selected blog ID:', selectedUserId);
    // console.log('Users:', users);
    if (selectedUserId && users.length) {
      let matchedSelectedUser = users.find(
        (blog) => blog.id === selectedUserId
      );
      setSelectedUser(matchedSelectedUser);
      console.log(matchedSelectedUser, users);
    }
  }, [users, selectedUserId]);

  if (!selectedUser) {
    return (
      <div className='text-center mt-10 text-gray-500'>
        You are not logged in.
      </div>
    );
  }

  return selectedUser.id && <UserDetails user={selectedUser} />;
};

export default OtherUserProfile;
