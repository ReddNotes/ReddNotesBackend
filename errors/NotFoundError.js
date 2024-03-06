// ? constants
const { STATUS } = require('../utils/constants');

module.exports = class NotFoundError extends Error {
  constructor({ type, action, method, errMessage }) {
    super(errMessage);
    this.type = type;
    this.action = action;
    this.method = method;
    this.statusCode = STATUS.ERROR.NOT_FOUND;
    this.errorMessage = errMessage;
  }
};
