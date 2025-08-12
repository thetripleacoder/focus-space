require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Blog = require('./models/blog');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/dev-blog-app';

const seed = async () => {
  try {
    console.log('🚀 Starting seed script...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧨 Dropping existing database...');
    await mongoose.connection.dropDatabase();

    const passwordHash = await bcrypt.hash('devpass', 10);

    console.log('👥 Seeding users...');
    const insertedUsers = await User.insertMany([
      { username: 'aldous', name: 'Aldous Dev', passwordHash },
      { username: 'luna', name: 'Luna Tester', passwordHash },
    ]);
    console.log(
      '✅ Users inserted:',
      insertedUsers.map((u) => u.username)
    );

    const [aldous, luna] = insertedUsers;

    console.log('📝 Seeding blogs...');
    const insertedBlogs = await Blog.insertMany([
      {
        title: 'GraphQL vs REST',
        author: 'Aldous Dev',
        url: 'https://dev.example.com/graphql-vs-rest',
        genres: ['tech', 'api'],
        user: aldous._id,
      },
      {
        title: 'Framer Motion Magic',
        author: 'Luna Tester',
        url: 'https://dev.example.com/framer-motion',
        genres: ['design', 'animation'],
        user: luna._id,
      },
      {
        title: 'Tailwind Tips',
        author: 'Aldous Dev',
        url: 'https://dev.example.com/tailwind-tips',
        genres: ['css', 'frontend'],
        user: aldous._id,
      },
    ]);
    console.log(
      '✅ Blogs inserted:',
      insertedBlogs.map((b) => b.title)
    );

    const [graphql, framer, tailwind] = insertedBlogs;

    console.log('🔁 Linking likes...');
    const aldousDoc = await User.findById(aldous._id);
    const lunaDoc = await User.findById(luna._id);

    const graphqlDoc = await Blog.findById(graphql._id);
    const framerDoc = await Blog.findById(framer._id);
    const tailwindDoc = await Blog.findById(tailwind._id);

    // Bidirectional likes
    aldousDoc.likedPosts.push(framerDoc._id); // Aldous likes Luna's blog
    lunaDoc.likedPosts.push(graphqlDoc._id, tailwindDoc._id); // Luna likes Aldous's blogs

    framerDoc.likedBy.push(aldousDoc._id);
    graphqlDoc.likedBy.push(lunaDoc._id);
    tailwindDoc.likedBy.push(lunaDoc._id);

    framerDoc.likes = 1;
    graphqlDoc.likes = 1;
    tailwindDoc.likes = 1;

    await Promise.all([
      aldousDoc.save(),
      lunaDoc.save(),
      graphqlDoc.save(),
      framerDoc.save(),
      tailwindDoc.save(),
    ]);

    console.log('✅ Seeded users, blogs, and likes');

    // Final verification
    const users = await User.find({});
    const blogs = await Blog.find({});
    console.log(
      '📦 Final users:',
      users.map((u) => u.username)
    );
    console.log(
      '📦 Final blogs:',
      blogs.map((b) => b.title)
    );
  } catch (err) {
    console.error('🚨 Seeding error:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
    process.exit(0);
  }
};

seed();
