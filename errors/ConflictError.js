// ? constants
const { STATUS } = require('../utils/constants');

module.exports = class ConflictError extends Error {
  constructor({ type, action, method, errMessage }) {
    super(errMessage);
    this.type = type;
    this.action = action;
    this.method = method;
    this.statusCode = STATUS.ERROR.CONFLICT;
    this.errorMessage = errMessage;
  }
};
