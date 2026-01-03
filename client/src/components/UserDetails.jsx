import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import { useBlogs } from '../hooks';

const UserDetails = ({ user }) => {
  const { data: blogs = [] } = useBlogs();

  if (!user) {
    return (
      <div className='text-center mt-10 text-gray-500'>
        You are not logged in.
      </div>
    );
  }

  // Add isAddedByUser flag to blogs
  const blogsWithUserFlag = blogs.map((blog) => ({
    ...blog,
    isAddedByUser: blog.user?.id === user.id,
  }));

  const userBlogs = blogsWithUserFlag.filter(
    (blog) => blog.user.id === user.id
  );
  const sortedBlogs = [...userBlogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const likedPosts = blogs.filter((blog) =>
    user.likedPosts?.some((id) => id === blog.id || id === blog._id?.toString())
  );

  return (
    <div className='max-w-4xl mx-auto mt-10 px-4 space-y-10'>
      {/* Profile Header */}
      <div className='flex items-center gap-4'>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className='w-16 h-16 rounded-full object-cover border border-gray-300'
          />
        ) : (
          <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold'>
            {user.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
        )}

        <div>
          <h1 className='text-2xl font-bold text-gray-800'>{user.name}</h1>
          <p className='text-sm text-gray-500'>@{user.username}</p>
        </div>
      </div>

      {/* User's Own Posts */}
      <div>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>
          Your Posts ({userBlogs.length})
        </h2>
        {sortedBlogs.length > 0 ? (
          <>
            {sortedBlogs.map((blog) => (
              <BlogCard key={blog.id} selectedBlog={blog} />
            ))}
          </>
        ) : (
          <p className='text-sm text-gray-500 italic'>
            You haven’t posted anything yet.
          </p>
        )}
      </div>

      {/* Liked Posts */}
      <div>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>
          Liked Posts
        </h2>
        {likedPosts.length > 0 ? (
          <ul className='space-y-4'>
            {likedPosts.map((post) => (
              <li
                key={post.id}
                className='p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition'
              >
                <Link
                  to={`/blogs/${post.id}`}
                  className='text-blue-600 font-semibold hover:underline'
                >
                  {post.title}
                </Link>
                <p className='text-sm text-gray-500'>Likes: {post.likes}</p>
                <p className='text-xs text-gray-400'>
                  Genres: {post.genres?.join(', ') || 'None'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-gray-500 italic'>No liked posts yet.</p>
        )}
      </div>
    </div>
  );
};

UserDetails.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
    likedPosts: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  }),
};

export default UserDetails;
