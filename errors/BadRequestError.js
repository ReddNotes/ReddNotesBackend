// ? constants
const { STATUS } = require('../utils/constants');

module.exports = class BadRequestError extends Error {
  constructor({ type, action, method, errMessage }) {
    super(errMessage);
    this.type = type;
    this.action = action;
    this.method = method;
    this.statusCode = STATUS.ERROR.BAD_REQUEST;
    this.errorMessage = errMessage;
  }
};
