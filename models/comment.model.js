// comment.model.js

// ! modules
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    creationDate: {
      type: Date,
      default: () => new Date(),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    }, // id of owner
    value: {
      type: String,
      require: true,
    }, // any info
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { versionKey: false },
);

module.exports = mongoose.model('comment', commentSchema);
