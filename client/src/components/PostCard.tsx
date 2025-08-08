import type { Post } from "../types/post";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const { text, media } = post;

  const renderMedia = () => {
    if (!media) return null;
    const url = URL.createObjectURL(media);
    if (media.type.startsWith('image')) {
      return <img src={url} alt="post" style={{ maxWidth: '100%' }} />;
    }
    if (media.type.startsWith('video')) {
      return <video src={url} controls style={{ maxWidth: '100%' }} />;
    }
    return null;
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      {text && <p>{text}</p>}
      {renderMedia()}
    </div>
  );
};

export default PostCard;
