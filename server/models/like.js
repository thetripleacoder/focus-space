const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

likeSchema.index({ user: 1, blog: 1 }, { unique: true }); // prevent duplicate likes

module.exports = mongoose.model('Like', likeSchema);
