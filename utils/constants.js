// constants.js

// ! modules
require('dotenv').config();

const CONFIG = require('./../config.json');

const SERVER_SETTING = {
  PORT: process.env.PORT || CONFIG.PORT,
  DB: {
    ADDRESS: process.env.DB_NAME || CONFIG.DB.NAME,
    ADDRESS: process.env.DB_ADDRESS || CONFIG.DB.ADDRESS,
  },
  SECRET_KEY: process.env.SECRET_KEY || CONFIG.SECRET_KEY,
};

const MESSAGE = {
  ERROR: {
    BAD_REQUEST: {
      SIMPLE: 'Bad request',
    },
    INCORRECT_DATA: {
      SIMPLE: 'Incorrect data entered',
    },
    FORBIDDEN: {
      SIMPLE: 'You are not allowed to do this operation',
    },
    NOT_FOUND: {
      SIMPLE: 'Not found',
    },
    NOT_AUTHORIZED: {
      SIMPLE: 'User is not authorized',
    },
    SERVER: {
      SIMPLE: 'SERVER ERROR',
    },
    DUPLICATE: {
      SIMPLE: 'You can not use these parameters, try other ones',
    },
    VALIDATION: {
      SIMPLE: 'Validation error',
      ID: 'Invalid id',
    },
  },
  INFO: {
    GET: {
      SIMPLE: 'Here info',
    },
    CREATED: {
      SIMPLE: 'Created',
    },
    POST: {
      SIMPLE: 'Was successful posted',
    },
    DELETE: {
      SIMPLE: 'Deleted',
    },
    PUT: {
      SIMPLE: 'Was successful put',
    },
    PATCH: {
      SIMPLE: 'Info patched',
      USER: 'Info of user was successful updated',
    },
    LOGOUT: { SIMPLE: 'You have successfully logged out' },
    LOGIN: { SIMPLE: 'You have successfully logged in' },
  },
};

const STATUS = {
  ERROR: {
    BAD_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    SERVER: 500,
  },
  INFO: {
    OK: 200,
    CREATED: 201,
  },
};

module.exports = {
  SERVER_SETTING,
  MESSAGE,
  STATUS,
};
