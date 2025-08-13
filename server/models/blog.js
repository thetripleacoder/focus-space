const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: String,
    likes: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    genres: [String],
    comments: [{ text: String, author: String, date: Date }],
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    strict: true, // ✅ Enforces schema fields only
  }
);

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
