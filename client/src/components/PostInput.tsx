import { useState } from 'react';
import type { Post } from '../types/post';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_POST } from '../graphql/mutations';

interface Props {
  onSubmit: (post: Post) => void;
  currentUser: { id: string; username: string } | null;
}

const PostInput = ({ onSubmit, currentUser }: Props) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [createPost] = useMutation(CREATE_POST);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!text && !media) return;

    if (!currentUser) {
      alert('Please log in to post');
      navigate('/profile');
      return;
    }

    let mediaUrl: string | undefined;
    let mediaType: string | undefined;

    // 1️⃣ If there's a file, upload it first
    if (media) {
      const formData = new FormData();
      formData.append('file', media);

      try {
        const uploadRes = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload file');

        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.url; // Cloudinary URL
        mediaType = uploadData.mediaType; // "image" or "video"
      } catch (err) {
        console.error('File upload failed:', err);
        return;
      }
    }

    // 2️⃣ Save post in MongoDB through GraphQL
    try {
      const { data } = await createPost({
        variables: {
          text,
          mediaUrl,
          mediaType,
        },
      });

      if (data?.createPost) {
        onSubmit(data.createPost);
      }

      setText('');
      setMedia(null);
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        style={{ width: '100%' }}
      />
      <input
        type='file'
        accept='image/*,video/*'
        onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

export default PostInput;
