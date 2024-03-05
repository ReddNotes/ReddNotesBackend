// note.model.js

// ! modules
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    creationDate: {
      type: Date,
      default: () => new Date(),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ], // list of users id
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
    images: {
      type: [String],
      maxLength: 16, // max photos in 1 note
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('note', noteSchema);
