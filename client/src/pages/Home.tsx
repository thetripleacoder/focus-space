import { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';

import PostInput from '../components/PostInput';
import PostCard from '../components/PostCard';
import { GET_POSTS } from '../graphql/queries';
import { POST_ADDED } from '../graphql/subscriptions';
import type { Post } from '../types/post';
import Login from '../components/Login';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch initial posts
  const { data, loading, error } = useQuery<{ posts: Post[] }>(GET_POSTS);

  // Handle new post from subscription
  useSubscription<{ postAdded: Post }>(POST_ADDED, {
    onData: ({ data }) => {
      const newPost = data.data?.postAdded;
      if (newPost) {
        setPosts((prev) => [newPost, ...prev]);
      }
    },
  });

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
    }
  }, [data]);

  const handleNewPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts 😢</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Home</h2>
      <Login />
      <PostInput onSubmit={handleNewPost} />

      <PostInput onSubmit={handleNewPost} />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
