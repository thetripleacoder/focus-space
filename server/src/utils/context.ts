// server/utils/context.ts
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const getContext = async (headersOrParams: any) => {
  const auth = headersOrParams?.authorization || '';
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decoded: any = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET || 'supersecret'
      );
      const currentUser = await User.findById(decoded.id);
      return { currentUser };
    } catch (err) {
      console.error('Invalid token');
    }
  }
  return { currentUser: null };
};
