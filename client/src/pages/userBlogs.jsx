import { useMatch } from 'react-router-dom';
import BlogList from '../components/BlogList';
import { useSelector } from 'react-redux';

export default function UserBlogs() {
  const selectedUserId = useMatch('/users/:id')?.params.id;
  const users = useSelector((state) => state.user.users);
  const selectedUser = users.find((user) => user.id === selectedUserId);
  const blogs = useSelector((state) => state.blogs);
  const filteredBlogs = blogs.filter((blog) => blog.user.id === selectedUserId);

  return (
    <div className='mt-4'>
      <h2>{selectedUser ? `${selectedUser.name}'s` : `User's`}</h2>
      <BlogList blogs={filteredBlogs} />
    </div>
  );
}
