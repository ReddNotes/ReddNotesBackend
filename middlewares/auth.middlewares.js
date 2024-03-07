// auth.middlewares.js

// ! modules
const jwt = require('jsonwebtoken');

// ? utils
const { SERVER_SETTING, STATUS } = require('../utils/constants');
const { NotAuthorizedError, ForbiddenError } = require('../errors/AllErrors');

class Auth {
  isUserAuthorized(req, token) {
    if (token == null) {
      return {
        statusCode: STATUS.ERROR.NOT_AUTHORIZED,
        errorMessage: 'Missing authorization token',
      };
    }

    return jwt.verify(token, SERVER_SETTING.SECRET_KEY, (err, user) => {
      if (err) {
        return {
          statusCode: STATUS.ERROR.FORBIDDEN,
          errorMessage: 'Token is not valid',
        };
      }
      req.user = user;
    });
  }

  createJwtToken(user) {
    return jwt.sign(
      {
        _id: user.id,
        username: user.username,
      },
      SERVER_SETTING.SECRET_KEY,
    );
  }
}

const auth = new Auth();

module.exports = auth;
