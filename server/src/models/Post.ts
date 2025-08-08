import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: String,
  mediaUrl: String,
  mediaType: String
});

export default mongoose.model('Post', postSchema);