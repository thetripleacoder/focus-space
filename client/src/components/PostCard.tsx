import type { Post } from '../types/post';

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const { text, mediaUrl, mediaType } = post;

  const renderMedia = () => {
    if (!mediaUrl || !mediaType) return null;

    if (mediaType === 'image') {
      return <img src={mediaUrl} alt='post' style={{ maxWidth: '100%' }} />;
    }

    if (mediaType === 'video') {
      return (
        <video controls style={{ maxWidth: '100%' }}>
          <source src={mediaUrl} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      {text && <p>{text}</p>}
      {renderMedia()}
    </div>
  );
};

export default PostCard;
