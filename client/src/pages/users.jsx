import { useSelector } from 'react-redux';
import UserList from '../components/UserList';
import { useBlogs } from '../hooks';

export default function Users() {
  const { data: blogs = [] } = useBlogs();
  const users = useSelector((state) => state.user.users);
  const enrichedUsers = users.map((user) => ({
    ...user,
    blogCount: blogs.filter((blog) => blog.user.id === user.id).length,
  }));

  return <UserList users={enrichedUsers} />;
}
