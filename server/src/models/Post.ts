import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    text: String,
    mediaUrl: String,
    mediaType: String,
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

export default mongoose.model('Post', postSchema);
