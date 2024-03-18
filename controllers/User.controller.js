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
    this.getAllUserInfo = this.getAllUserInfo.bind(this);
    this.getOneUserInfoById = this.getOneUserInfoById.bind(this);
    this.getOneUserInfoByToken = this.getOneUserInfoByToken.bind(this);
    this.updateUserInfoByToken = this.updateUserInfoByToken.bind(this);
  }

  // get info about all users
  async getAllUserInfo(data, req) {
    try {
      const users = await userSchema.find({});

      if (!users) {
        throw new NotFoundError({
          type: this.type,
          action: 'get',
          method: 'all',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USERS,
        });
      }

      return {
        type: this.type,
        action: 'get',
        method: 'all',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.USERS,
        data: users,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // get info about user by id
  async getOneUserInfoById(data, req) {
    try {
      const user = await userSchema.findById(data.data.userId);

      if (!user) {
        throw new NotFoundError({
          type: this.type,
          action: 'get',
          method: 'one by id',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      const userInfo = { ...user }._doc;

      delete userInfo.chats;

      return {
        type: this.type,
        action: 'get',
        method: 'one by id',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.USER,
        data: userInfo,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // get info about current user
  async getOneUserInfoByToken(data, req) {
    try {
      const user = await userSchema.findById(req.user._id);

      if (!user) {
        throw new NotFoundError({
          type: this.type,
          action: 'get',
          method: 'one by token',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      return {
        type: this.type,
        action: 'get',
        method: 'one by token',
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
          avatar: data.data.avatar,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          birthday: data.data.birthday,
          description: data.data.description,
        },
        { new: true },
      );

      if (!user) {
        throw new NotFoundError({
          type: this.type,
          action: 'update',
          method: 'data',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      return {
        type: this.type,
        action: 'update',
        method: 'data',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.PATCH.SETTINGS,
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // update user settings
  async updateUserSettingsByToken(data, req) {
    try {
      const user = await userSchema.findByIdAndUpdate(
        req.user._id,
        {
          settings: {
            theme: data.data.theme,
            notification: data.data.notification,
          },
        },
        { new: true },
      );

      if (!user) {
        throw new NotFoundError({
          type: this.type,
          action: 'update',
          method: 'settings',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      return {
        type: this.type,
        action: 'update',
        method: 'settings',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.PATCH.SETTINGS,
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }
}

module.exports = User;
