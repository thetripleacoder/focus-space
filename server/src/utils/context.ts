import jwt from 'jsonwebtoken';
import User from '../models/User';

export const getContext = async (authHeader: string | undefined) => {
  if (!authHeader) return {};
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
    const currentUser = await User.findById(decoded.id);
    return { currentUser };
  } catch (error) {
    return {};
  }
};