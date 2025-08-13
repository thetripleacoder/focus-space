export const sanitizeBlogForUpdate = (blog) => {
  const {
    title,
    likes,
    user,
    genres,
    comments,
    likedBy,
    createdAt,
    url,
    author,
  } = blog;

  return {
    title,
    likes,
    user,
    genres,
    comments,
    likedBy,
    createdAt,
    url,
    author,
  };
};
