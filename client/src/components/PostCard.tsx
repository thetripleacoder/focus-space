import type { Post } from '../types/post';

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const { text, mediaUrl, mediaType } = post;

  const renderMedia = () => {
    if (!mediaUrl || !mediaType) return null;

    if (mediaType === 'image') {
      return (
        <img
          src={mediaUrl}
          alt='post'
          className='rounded-lg w-full max-h-[500px] object-cover mt-3'
        />
      );
    }

    if (mediaType === 'video') {
      return (
        <video controls className='rounded-lg w-full max-h-[500px] mt-3'>
          <source src={mediaUrl} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      );
    }

    return null;
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
      {text && <p className='text-gray-800 text-base'>{text}</p>}
      {renderMedia()}
    </div>
  );
};

export default PostCard;
