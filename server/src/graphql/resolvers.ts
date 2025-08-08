import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import User from '../models/User';
import Post from '../models/Post';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      return context.currentUser;
    },
    posts: async () => {
      return await Post.find({});
    },
  },
  Mutation: {
    login: async (_: any, { username }: { username: string }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || '');
      return token;
    },
    createPost: async (_: any, { text, mediaUrl, mediaType }: any, context: any) => {
      if (!context.currentUser) throw new Error('Not authenticated');
      const post = new Post({ text, mediaUrl, mediaType });
      const savedPost = await post.save();
      pubsub.publish('POST_ADDED', { postAdded: savedPost });
      return savedPost;
    }
  },
  Subscription: {
    time: {
      subscribe: async function* () {
        while (true) {
          await new Promise((res) => setTimeout(res, 1000));
          yield { time: new Date().toISOString() };
        }
      }
    },
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
  }
};