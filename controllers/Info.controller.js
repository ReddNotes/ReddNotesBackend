// Info.controller.js

// ? models
const postSchema = require('./../models/post.model');
const userSchema = require('./../models/user.model');

// ? utils
const { STATUS, MESSAGE } = require('../utils/constants');

class Info {
  constructor({ sendError }) {
    this.type = 'info';
    this.sendError = sendError;

    // ? binding
    this.countAllUsers = this.countAllUsers.bind(this);
    this.countAllPosts = this.countAllPosts.bind(this);
  }

  // get count of all users
  async countAllUsers() {
    try {
      const result = await userSchema.countDocuments();

      return {
        type: this.type,
        action: 'count all users',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.SIMPLE,
        data: result,
      };
    } catch (err) {
      this.sendError(new Error(err));
    }
  }

  // get count of all posts
  async countAllPosts() {
    try {
      const result = await postSchema.countDocuments();

      return {
        type: this.type,
        action: 'count all posts',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.SIMPLE,
        data: result,
      };
    } catch (err) {
      this.sendError(new Error(err));
    }
  }
}

module.exports = Info;
