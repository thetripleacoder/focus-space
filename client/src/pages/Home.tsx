import { useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import PostInput from '../components/PostInput';
import PostCard from '../components/PostCard';
import { GET_POSTS, ME } from '../graphql/queries';
import { POST_ADDED } from '../graphql/subscriptions';
import type { Post } from '../types/post';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ posts: Post[] }>(GET_POSTS);
  const { data: userData } = useQuery(ME);

  useSubscription<{ postAdded: Post }>(POST_ADDED, {
    onData: ({ data }) => {
      const newPost = data.data?.postAdded;
      if (newPost) {
        setPosts((prev) => {
          if (prev.some((p) => p.id === newPost.id)) return prev;
          return [newPost, ...prev];
        });
      }
    },
  });

  useEffect(() => {
    if (data?.posts) {
      setPosts(data.posts);
    }
  }, [data]);

  const handleNewPost = (post: Post) => {
    if (!userData?.me) {
      navigate('/profile');
      return;
    }
    setPosts((prev) => {
      if (prev.some((p) => p.id === post.id)) return prev;
      return [post, ...prev];
    });
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts 😢</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Home</h2>
      <PostInput onSubmit={handleNewPost} currentUser={userData?.me} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
