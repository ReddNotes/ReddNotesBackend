// Auth.controller.js

// ! modules
const bcrypt = require('bcrypt');

// ? error
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('./../errors/AllErrors');

// ? middlewares
const auth = require('./../middlewares/auth.middlewares');

// ? models
const userSchema = require('./../models/user.model');

// ? utils
const { STATUS, MESSAGE } = require('./../utils/constants');

class Auth {
  constructor({ sendError }) {
    this.type = 'auth';
    this.sendError = sendError;

    // ? binding
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.loginByToken = this.loginByToken.bind(this);
  }

  // login by data
  async login(data, req) {
    try {
      const _nickname = data.data.nickname?.trim();
      const _password = data.data.password?.trim();

      // check value
      if (!_nickname || !_password) {
        throw new BadRequestError({
          type: this.type,
          action: 'login',
          method: 'by data',
          errMessage: MESSAGE.ERROR.VALIDATION.VALUE_MISSING,
        });
      }

      const user = await userSchema.findUserByCredentials(_nickname, _password);

      if (!user) {
        throw new NotFoundError({
          type: this.type,
          action: 'login',
          method: 'by data',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      return {
        type: this.type,
        action: 'login',
        method: 'by data',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.LOGIN.SIMPLE,
        token: auth.createJwtToken(user),
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // login by token
  async loginByToken(data, req) {
    if (!auth.checkToken(data.token, req, this.sendError)) return;

    try {
      const user = await userSchema.findByIdAndUpdate(
        req.user._id,
        {
          isActive: true,
        },
        { new: true },
      );

      if (!user) {
        throw new NotFoundError({
          type: 'auth',
          action: 'login',
          method: 'by token',
          errMessage: MESSAGE.ERROR.NOT_FOUND.USER,
        });
      }

      return {
        type: this.type,
        action: 'login',
        method: 'by token',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.LOGIN.SIMPLE,
        data: user,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // create a new user
  async signup(data, req) {
    try {
      const _nickname = data.data.nickname?.trim();
      const _password = data.data.password?.trim();

      // check value
      if (!_nickname || !_password) {
        throw new BadRequestError({
          type: this.type,
          action: 'signup',
          method: '',
          errMessage: MESSAGE.ERROR.VALIDATION.VALUE_MISSING,
        });
      }

      const hash = await bcrypt.hash(_password, 10);

      const user = await userSchema.create({
        nickname: data.data.nickname,
        password: hash,
        avatar: data.data.avatar,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        birthday: data.data.birthday,
        description: data.data.description,
      });

      const token = auth.createJwtToken(user);

      return {
        type: this.type,
        action: 'signup',
        statusCode: STATUS.INFO.CREATED,
        statusMessage: MESSAGE.INFO.CREATED.USER,
        data: user,
        token: token,
      };
    } catch (err) {
      if (err.code === 11000) {
        return this.sendError(
          new ConflictError({
            type: this.type,
            action: 'signup',
            method: '',
            errMessage: MESSAGE.ERROR.DUPLICATE.USER,
          }),
        );
      } else {
        return this.sendError(err);
      }
    }
  }
}

module.exports = Auth;
