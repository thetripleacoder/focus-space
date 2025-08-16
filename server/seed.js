require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Blog = require('./models/blog');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/dev-blog-app';
const JWT_SECRET = process.env.SECRET;

const seed = async () => {
  try {
    console.log('🚀 Starting seed script...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧨 Dropping existing database...');
    await mongoose.connection.dropDatabase();

    const passwordHash = await bcrypt.hash('devpass', 10);

    console.log('👥 Seeding users...');
    const seedUsers = [
      {
        username: 'aldous',
        name: 'Aldous Dev',
        avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=aldous',
        passwordHash,
      },
      {
        username: 'luna',
        name: 'Luna Tester',
        avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=luna',
        passwordHash,
      },
    ];
    const insertedUsers = await User.insertMany(seedUsers);
    console.log(
      '✅ Users inserted:',
      insertedUsers.map((u) => u.username)
    );

    const aldous = await User.findOne({ username: 'aldous' });
    const luna = await User.findOne({ username: 'luna' });

    // console.log('📝 Seeding blogs...');
    // const seedBlogs = [
    //   {
    //     title: 'GraphQL vs REST',
    //     genres: ['tech', 'api'],
    //     user: aldous._id,
    //   },
    //   {
    //     title: 'Framer Motion Magic',
    //     genres: ['design', 'animation'],
    //     user: luna._id,
    //   },
    //   {
    //     title: 'Tailwind Tips',
    //     genres: ['css', 'frontend'],
    //     user: aldous._id,
    //   },
    // ];
    // const insertedBlogs = await Blog.insertMany(seedBlogs);
    // console.log(
    //   '✅ Blogs inserted:',
    //   insertedBlogs.map((b) => b.title)
    // );

    // const graphql = await Blog.findOne({ title: 'GraphQL vs REST' });
    // const framer = await Blog.findOne({ title: 'Framer Motion Magic' });
    // const tailwind = await Blog.findOne({ title: 'Tailwind Tips' });

    // console.log('🔁 Linking likes and comments...');
    // aldous.likedPosts = [framer._id];
    // luna.likedPosts = [graphql._id, tailwind._id];

    // framer.likedBy = [aldous._id];
    // graphql.likedBy = [luna._id];
    // tailwind.likedBy = [luna._id];

    // framer.likes = 1;
    // graphql.likes = 1;
    // tailwind.likes = 1;

    // graphql.comments = [{ text: 'Great comparison!', author: luna._id }];
    // tailwind.comments = [{ text: 'Super helpful tips!', author: luna._id }];

    // await Promise.all([
    //   aldous.save(),
    //   luna.save(),
    //   graphql.save(),
    //   framer.save(),
    //   tailwind.save(),
    // ]);

    console.log('✅ Seeded users, blogs, likes, and comments');

    // 🔐 Generate fresh JWT tokens
    // 🔐 Generate fresh JWT tokens (same logic as login)
    const aldousToken = jwt.sign(
      { username: aldous.username, id: aldous._id },
      JWT_SECRET
    );

    const lunaToken = jwt.sign(
      { username: luna.username, id: luna._id },
      JWT_SECRET
    );

    console.log('\n🔑 Dev tokens (no expiration):');
    console.log(`Aldous: Bearer ${aldousToken}`);
    console.log(`Luna:   Bearer ${lunaToken}\n`);

    // Final verification
    const users = await User.find({}).populate('likedPosts').lean();
    const blogs = await Blog.find({})
      .populate('likedBy')
      .populate('user')
      .lean();

    console.log('📦 Final users and their liked posts:');
    users.forEach((u) => {
      console.log(
        `- ${u.username} likes: ${u.likedPosts.map((b) => b.title).join(', ')}`
      );
    });

    console.log('📦 Final blogs and their likedBy users:');
    blogs.forEach((b) => {
      console.log(
        `- ${b.title} by ${b.user.username} liked by: ${b.likedBy
          .map((u) => u.username)
          .join(', ')}`
      );
    });
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
