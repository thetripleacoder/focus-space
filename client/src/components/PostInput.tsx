import { useState } from 'react';
import type { Post } from '../types/post';

interface Props {
  onSubmit: (post: Post) => void;
}

const PostInput = ({ onSubmit }: Props) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const handleSubmit = () => {
    if (text || media) {
      onSubmit({ text, media: media ?? undefined });
      setText('');
      setMedia(null);
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
      <input type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files?.[0] ?? null)} />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

export default PostInput;
