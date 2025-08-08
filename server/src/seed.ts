// seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Post from './models/Post';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/focus-space';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'focus-space' });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create users
    const users = await User.insertMany([
      { username: 'alice', email: 'alice@example.com' },
      { username: 'bob', email: 'bob@example.com' },
    ]);

    console.log(
      'Seeded users:',
      users.map((u) => u.username)
    );

    // Create posts
    const posts = await Post.insertMany([
      {
        text: 'Hello World!',
        mediaUrl: '',
        mediaType: '',
        createdAt: new Date(),
      },
      {
        text: 'Another post',
        mediaUrl: '',
        mediaType: '',
        createdAt: new Date(),
      },
    ]);

    console.log(
      'Seeded posts:',
      posts.map((p) => p.text)
    );

    console.log('✅ Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seed();
