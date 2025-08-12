import { useSelector } from 'react-redux';
import UserList from '../components/UserList';

export default function Users() {
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.user.users);
  const enrichedUsers = users.map((user) => ({
    ...user,
    blogCount: blogs.filter((blog) => blog.user.id === user.id).length,
  }));

  return <UserList users={enrichedUsers} />;
}
