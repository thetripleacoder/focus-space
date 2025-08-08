import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLUpload } from 'graphql-upload-ts';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User';
import Post from '../models/Post';

const pubsub = new PubSub();

export const resolvers = {
  Upload: GraphQLUpload, // ✅ for scalar Upload

  Query: {
    me: async (_: any, __: any, context: any) => context.currentUser,
    posts: async () => await Post.find({}),
  },

  Mutation: {
    register: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const user = new User({ username, passwordHash });
      return await user.save();
    },

    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new Error('Invalid credentials');

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET || ''
      );
      return token;
    },

    createPost: async (
      _: any,
      {
        text,
        mediaUrl,
        mediaType,
      }: { text?: string; mediaUrl?: string; mediaType?: string },
      context: any
    ) => {
      if (!context.currentUser) throw new Error('Not authenticated');
      const post = new Post({ text, mediaUrl, mediaType });
      const savedPost = await post.save();
      pubsub.publish('POST_ADDED', { postAdded: savedPost });
      return savedPost;
    },

    // ✅ New GraphQL upload mutation
    uploadFile: async (_: any, { file }: any) => {
      const { createReadStream, filename, mimetype } = await file;

      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'focus-space', resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        createReadStream().pipe(stream);
      });

      const result: any = await uploadPromise;
      return { mediaUrl: result.secure_url };
    },
  },

  Subscription: {
    time: {
      subscribe: async function* () {
        while (true) {
          await new Promise((res) => setTimeout(res, 1000));
          yield { time: new Date().toISOString() };
        }
      },
    },
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
  },
};
