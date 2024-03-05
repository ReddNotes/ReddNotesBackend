// user.model.js

// ! modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ? errors
const { BadRequestError, NotFoundError } = require('../errors/AllErrors');

// ? utils
const { MESSAGE } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    creationDate: {
      type: Date,
      default: () => new Date(),
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note',
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note',
      },
    ],
    avatar: {
      type: String,
      default:
        'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      default: 'I am a new user ReddNotes',
    },
  },
  { versionKey: false },
);

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

function findUserByCredentials(nickname, password) {
  return this.findOne({ nickname })
    .select('+password')
    .orFail(() => new NotFoundError(MESSAGE.ERROR.NOT_FOUND.USER))
    .then((user) => {
      if (!user) {
        throw new NotAuthorized(MESSAGE.ERROR.NOT_AUTHORIZED.SIMPLE);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new BadRequestError(MESSAGE.ERROR.PASS.SIMPLE);
        }
        return user;
      });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
