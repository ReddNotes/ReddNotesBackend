// ? constants
const { STATUS } = require('../utils/constants');

module.exports = class ForbiddenError extends Error {
  constructor({ type, action, method, errMessage }) {
    super(errMessage);
    this.type = type;
    this.action = action;
    this.method = method;
    this.statusCode = STATUS.ERROR.FORBIDDEN;
    this.errorMessage = errMessage;
  }
};
