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
        // 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
        'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
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
      default: 'I am a new user of ReddNotes',
    },
    settings: {
      theme: {
        type: String,
        default: 'light',
      },
      notification: {
        type: Boolean,
        default: true,
      },
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
    .orFail(
      () =>
        new NotFoundError({
          type: 'auth',
          action: 'login',
          method: 'by data',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        }),
    )
    .then((user) => {
      if (!user) {
        throw new NotAuthorized({
          type: 'auth',
          action: 'login',
          method: 'by data',
          errMessage: MESSAGE.ERROR.NOT_AUTHORIZED.SIMPLE,
        });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new BadRequestError({
            type: 'auth',
            action: 'login',
            method: 'by data',
            errMessage: MESSAGE.ERROR.INCORRECT_DATA.PASSWORD,
          });
        }
        return user;
      });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
