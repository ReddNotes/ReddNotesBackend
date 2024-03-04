// User.controller.js

// ? errors
const { NotFoundError } = require('../errors/AllErrors');

// ? models
const userSchema = require('./../models/user.model');

// ? utils
const { STATUS, MESSAGE } = require('./../utils/constants');

class User {
  constructor({ sendError }) {
    this.type = 'user';
    this.sendError = sendError;

    // ? binding
    this.getUserInfoById = this.getUserInfoById.bind(this);
    this.getUserInfoByToken = this.getUserInfoByToken.bind(this);
    this.updateUserInfoByToken = this.updateUserInfoByToken.bind(this);
  }

  // get info about user by id
  async getUserInfoById(data, req) {
    try {
      const user = await userSchema.findById(data.data.userId);

      if (!user) {
        throw new NotFoundError(MESSAGE.ERROR.NOT_FOUND.USER);
      }

      const userInfo = { ...user }._doc;

      delete userInfo.chats;

      return {
        type: this.type,
        action: 'get user info',
        method: 'by id',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.USER,
        data: userInfo,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // get info about current user
  async getUserInfoByToken(data, req) {
    try {
      const user = await userSchema.findById(req.user._id);

      if (!user) {
        throw new NotFoundError(MESSAGE.ERROR.NOT_FOUND.USER);
      }

      return {
        type: this.type,
        action: 'get',
        method: 'by token',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.USER,
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // update user information
  async updateUserInfoByToken(data, req) {
    try {
      const user = await userSchema.findByIdAndUpdate(
        req.user._id,
        {
          email: data.data.email,
          avatar: data.data.avatar,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          birthday: data.data.birthday,
          city: data.data.city,
        },
        { new: true },
      );

      if (!user) {
        throw new NotFoundError(MESSAGE.ERROR.NOT_FOUND.USER);
      }

      return {
        type: this.type,
        action: 'update',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.PATCH.USER,
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }
}

module.exports = User;
