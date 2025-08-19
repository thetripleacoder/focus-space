require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3003,
  MONGODB_URI:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI,
  ALLOWED_ORIGINS:
    process.env.FRONTEND_ORIGIN?.split(',').map((o) => o.trim()) || [],
};
