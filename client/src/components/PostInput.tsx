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
  const [createPost] = useMutation<{ createPost: Post }>(CREATE_POST);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!text && !media) return;

    if (!currentUser) {
      alert('Please log in to post');
      navigate('/profile');
      return;
    }

    let mediaUrl: string | undefined = undefined;
    let mediaType: string | undefined = undefined;

    if (media) {
      const formData = new FormData();
      formData.append('file', media);
      console.log(formData);

      try {
        const uploadRes = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload file');

        const uploadData = await uploadRes.json();

        mediaUrl = uploadData.mediaUrl; // server returns mediaUrl
        mediaType = media.type.startsWith('image') ? 'image' : 'video';
      } catch (err) {
        console.error('File upload failed:', err);
        return;
      }
    }

    try {
      const variables: {
        text?: string;
        mediaUrl?: string;
        mediaType?: string;
      } = {};

      if (text.trim() !== '') variables.text = text.trim();
      if (mediaUrl) variables.mediaUrl = mediaUrl;
      if (mediaType) variables.mediaType = mediaType;
      if (Object.keys(variables).length === 0) {
        console.warn('No content to post');
        return;
      }
      console.log(variables);

      const { data } = await createPost({ variables });

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
    <div className='bg-white rounded-lg shadow p-4 mb-6'>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <div className='mt-3 flex items-center justify-between'>
        <input
          type='file'
          accept='image/*,video/*'
          onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
          className='text-sm text-gray-600'
        />
        <button
          onClick={handleSubmit}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostInput;
