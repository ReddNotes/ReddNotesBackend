// todo write backend

// index.js

// ! modules
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const expressWs = require('express-ws');
const morgan = require('morgan');
const mongoose = require('mongoose');

// ? controllers
const AuthController = require('./controllers/Auth.controller');
const CommentsController = require('./controllers/Comment.controller');
const InfoController = require('./controllers/Info.controller');
const NoteController = require('./controllers/Note.controller');
const UserController = require('./controllers/User.controller');

// ? error
const { NotFoundError, BadRequestError } = require('./errors/AllErrors');

// ? middlewares
const auth = require('./middlewares/auth.middlewares');

// ? utils
const { SERVER_SETTING } = require('./utils/constants');

// ! init
const server = express();
expressWs(server);

// Create a new set to hold each clients socket connection
const connections = new Set();
let connectionsLength = 0;

// CORS
server.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  }),
);

// for cool dev comments in console
server.use(morgan('dev'));

function updateConnectionsInfo(ws, data) {
  connections.forEach((obj) => {
    if (obj.ws === ws) {
      connections.delete(obj);
    }
  });
  connections.add({ ws: ws, _id: data._id });
}

async function mainHandler(ws, req, next) {
  // init controllers
  const authController = new AuthController({
    sendError: _sendError,
  });
  const userController = new UserController({
    sendError: _sendError,
  });
  const infoController = new InfoController({
    sendError: _sendError,
  });
  const noteController = new NoteController({
    sendError: _sendError,
  });
  const commentsController = new CommentsController({
    sendError: _sendError,
  });

  // ? functions

  // send error
  function _sendError(err) {
    console.error('WebSocket Error:', err);
    // Отправляем ошибку обратно клиенту через WebSocket
    ws.send(
      JSON.stringify({
        statusCode: err.statusCode,
        errorMessage: err.errorMessage,
      }),
    );
  }

  // send other users by id information
  function _sendInfoToOnlineUser(data) {
    connections.forEach((obj) => {
      obj.ws.send(JSON.stringify(data));
    });
  }

  //
  console.log('WebSocket connected');

  connections.add({ ws: ws });
  connectionsLength++;

  ws.on('message', async (msg) => {
    let data;

    try {
      data = await JSON.parse(msg);
    } catch (err) {
      return _sendError(new BadRequestError('Messages must be valid JSON'));
    }

    switch (data.type) {
      // ? all functionally with auth
      case 'auth': {
        switch (data.action) {
          // ? login by data
          case 'login': {
            const result = await authController.login(data, req, ws);

            if (!result) return;

            updateConnectionsInfo(ws, result.data);

            ws.send(JSON.stringify(result));

            break;
          }

          // ? login by token
          case 'loginByToken': {
            const result = await authController.loginByToken(data, req, ws);

            if (!result) return;

            updateConnectionsInfo(ws, result.data);

            ws.send(JSON.stringify(result));

            break;
          }

          // ? register a new one user
          case 'signup': {
            const res = await authController.signup(data, req, ws);

            if (!res) return;

            updateConnectionsInfo(ws, res.data);

            _sendInfoToOnlineUser(res);

            break;
          }

          default:
            _sendError(
              new NotFoundError(
                `Not found this action [${data.action}] in action [${data.type}]`,
              ),
            );
            break;
        }
        break;
      }

      // ? all functionally with info of all
      case 'info': {
        switch (data.action) {
          // ? count of all users
          case 'count all users': {
            ws.send(JSON.stringify(await infoController.countAllUsers()));
            break;
          }

          // ? count of online users
          case 'count all notes': {
            ws.send(JSON.stringify(await infoController.countAllNotes()));
            break;
          }

          default: {
            _sendError(
              new NotFoundError(
                `Not found this action [${data.action}] in action [${data.type}]`,
              ),
            );
            break;
          }
        }
        break;
      }

      // ? all functionally with user
      case 'user': {
        switch (data.action) {
          // ? update user info
          case 'update': {
            // check token
            const error = auth.isUserAuthorized(req, data.token);
            if (error) return _sendError(error);

            const res = await userController.updateUserInfoByToken(data, req);

            if (!res) return;

            _sendInfoToOnlineUser(res);

            break;
          }

          // ? get user info
          case 'get': {
            switch (data.method) {
              // ? all
              case 'all': {
                // check token
                const error = auth.isUserAuthorized(req, data.token);
                if (error) return _sendError(error);

                const res = await userController.getAllUserInfo(data, req);

                if (!res) return;

                ws.send(JSON.stringify(res));
                break;
              }

              // ? by token
              case 'one by token': {
                // check token
                const error = auth.isUserAuthorized(req, data.token);
                if (error) return _sendError(error);

                const res = await userController.getOneUserInfoByToken(
                  data,
                  req,
                );

                if (!res) return;

                ws.send(JSON.stringify(res));
                break;
              }

              // ? by id
              case 'one by id': {
                // check token
                const error = auth.isUserAuthorized(req, data.token);
                if (error) return _sendError(error);

                const res = await userController.getOneUserInfoById(data, req);

                if (!res) return;

                ws.send(JSON.stringify(res));
                break;
              }

              default: {
                _sendError(
                  new NotFoundError(
                    `Not found this method [${data.method}] in action [${data.action}] in type [${data.type}]`,
                  ),
                );
                break;
              }
            }
            break;
          }

          default: {
            _sendError(
              new NotFoundError(
                `Not found this action [${data.action}] in type [${data.type}]`,
              ),
            );
            break;
          }
        }
        break;
      }

      // ? all functionally with note
      case 'note': {
        auth.isUserAuthorized(req, data.token, _sendError);

        switch (data.action) {
          // ? get note info by id
          case 'get': {
            switch (data.method) {
              // ? all
              case 'all': {
                const res = await noteController.getAllNotes(data, req);

                if (!res) return;

                ws.send(JSON.stringify(res));
                break;
              }

              default: {
                _sendError(
                  new NotFoundError(
                    `Not found this method [${data.method}] in action [${data.action}] in type [${data.type}]`,
                  ),
                );
                break;
              }
            }
            break;
          }

          // ? create a new one chat with user/users by Id
          case 'create': {
            // check token
            const error = auth.isUserAuthorized(req, data.token);
            if (error) return _sendError(error);

            const res = await noteController.createOneNote(data, req);

            if (!res) return;

            _sendInfoToOnlineUser(res);

            break;
          }

          default: {
            _sendError(
              new NotFoundError(
                `Not found this action [${data.action}] in action [${data.type}]`,
              ),
            );
            break;
          }
        }

        break;
      }

      // ? all functionally with message
      case 'comment': {
        switch (data.action) {
          // ? send a message in chat by id
          case 'create': {
            // check token
            const error = auth.isUserAuthorized(req, data.token);
            if (error) return _sendError(error);

            const res = await commentsController.createOneComment(data, req);

            if (!res) return;

            _sendInfoToOnlineUser(res);

            break;
          }

          // ? update value of comment
          case 'update': {
            // check token
            const error = auth.isUserAuthorized(req, data.token);
            if (error) return _sendError(error);

            const res = await commentsController.updateOneCommentById(
              data,
              req,
            );

            if (!res) return;

            _sendInfoToOnlineUser(res);

            break;
          }

          // ? delete message
          case 'delete': {
            // check token
            const error = auth.isUserAuthorized(req, data.token);
            if (error) return _sendError(error);

            const res = await commentsController.deleteOneCommentById(
              data,
              req,
            );

            if (!res) return;

            _sendInfoToOnlineUser(res);

            break;
          }

          default: {
            _sendError(
              new NotFoundError(
                `Not found this action [${data.action}] in action [${data.type}]`,
              ),
            );
            break;
          }
        }
        break;
      }

      default: {
        _sendError(new NotFoundError('Not found this type'));
        break;
      }
    }
  });

  ws.on('close', async () => {
    console.log('WebSocket disconnected');

    connections.forEach(async (obj) => {
      if (obj.ws === ws) {
        connections.delete(obj);
      }
    });

    connectionsLength--;
  });
}

server.ws('/websocket', mainHandler);

server.use(express.json());

// ? start server
server.listen(SERVER_SETTING.PORT, async () => {
  console.clear();
  await mongoose.connect(SERVER_SETTING.DB.ADDRESS);
  console.log('Connecting to MongoDB');
  console.log(`Server is running at port [${SERVER_SETTING.PORT}]`);
});
