export const sanitizeBlogForUpdate = (blog) => {
  const { title, likes, user, genres, comments, likedBy, createdAt } = blog;

  return {
    title,
    likes,
    user,
    genres,
    comments,
    likedBy,
    createdAt,
  };
};
