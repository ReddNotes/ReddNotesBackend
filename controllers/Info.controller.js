// Info.controller.js

// ? models
const noteSchema = require('../models/note.model');
const userSchema = require('./../models/user.model');

// ? utils
const { STATUS, MESSAGE } = require('../utils/constants');

class Info {
  constructor({ sendError }) {
    this.type = 'info';
    this.sendError = sendError;

    // ? binding
    this.countAllUsers = this.countAllUsers.bind(this);
    this.countAllNotes = this.countAllNotes.bind(this);
  }

  // get count of all users
  async countAllUsers() {
    try {
      const result = await userSchema.countDocuments();

      return {
        type: this.type,
        action: 'count all users',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.USERS,
        data: result,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // get count of all notes
  async countAllNotes() {
    try {
      const result = await noteSchema.countDocuments();

      return {
        type: this.type,
        action: 'count all notes',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.NOTES,
        data: result,
      };
    } catch (err) {
      this.sendError(err);
    }
  }
}

module.exports = Info;
