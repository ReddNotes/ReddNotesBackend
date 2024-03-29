// constants.js

// ! modules
require('dotenv').config();

const CONFIG = require('./../config.json');

const SERVER_SETTING = {
  PORT: process.env.PORT || CONFIG.PORT,
  DB: {
    NAME: process.env.DB_NAME || CONFIG.DB.NAME,
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
      PASSWORD: 'Password is incorrect',
    },
    FORBIDDEN: {
      SIMPLE: 'You are not allowed to do this operation',
      COMMENT: 'You are not allowed to do operations with this comment',
      NOTE: 'You are not allowed to do operations with this note',
      REACTION: {
        SIMPLE: 'You are not allowed to work with this reaction',
        SET: 'You are already set reaction',
        DELETE: 'You do not set reaction yet',
      },
      FAVORITE: {
        ADD: 'You are already added note',
        DELETE: 'You do not add this note yet',
      },
    },
    NOT_FOUND: {
      SIMPLE: 'Not found',
      USER: 'Not found user',
      USERS: 'Not found users',
      NOTE: 'Not found note',
      NOTES: 'Not found any notes',
      COMMENT: 'Not found comment',
    },
    NOT_AUTHORIZED: {
      SIMPLE: 'User is not authorized',
    },
    SERVER: {
      SIMPLE: 'SERVER ERROR',
    },
    DUPLICATE: {
      SIMPLE: 'You can not use these parameters, try other ones',
      USER: 'User with this nickname already exist',
    },
    VALIDATION: {
      SIMPLE: 'Validation error',
      ID: 'Invalid id',
      VALUE_MISSING: 'Value are require',
    },
  },
  INFO: {
    GET: {
      SIMPLE: 'Here info',
      USER: 'Here info about user',
      USERS: 'Here info about users',
      NOTE: 'Here info about note',
      NOTES: 'Here info about notes',
    },
    CREATED: {
      SIMPLE: 'Created',
      USER: 'User was successful created',
      NOTE: 'Note was successful created',
      COMMENT: 'Comment was successful created',
    },
    POST: {
      SIMPLE: 'Was successful posted',
    },
    DELETE: {
      SIMPLE: 'Deleted',
      COMMENT: 'Comment was successful deleted',
      REACTION: 'Reaction was successful delete',
      NOTE: 'Note was successful delete',
    },
    PUT: {
      SIMPLE: 'Was successful put',
      REACTION: 'Reaction was successful set',
      FAVORITE: 'Was successful added to favorites',
    },
    UPDATE: {
      SIMPLE: 'Info patched',
      USER: 'Info of user was successful updated',
      COMMENT: 'Comment of note was successful updated',
    },
    PATCH: {
      SIMPLE: 'Info patched',
      USER: 'Info of user was successful updated',
      SETTINGS: 'Info of users settings was successful updated',
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
    DELETE: 204,
  },
};

module.exports = {
  SERVER_SETTING,
  MESSAGE,
  STATUS,
};
