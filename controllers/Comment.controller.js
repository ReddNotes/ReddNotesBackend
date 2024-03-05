// Comments.controller.js

// ? errors
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/AllErrors');

// ? models
const commentSchema = require('../models/comment.model');
const noteSchema = require('../models/note.model');

// ? utils
const { STATUS, MESSAGE } = require('../utils/constants');
const { isValidHex24 } = require('../utils/utils');

class Comments {
  constructor({ sendError }) {
    this.type = 'comment';
    this.sendError = sendError;

    // ? binding
    this.createOneComment = this.createOneComment.bind(this);
    this.updateOneCommentById = this.updateOneCommentById.bind(this);
    this.deleteOneCommentById = this.deleteOneCommentById.bind(this);
  }

  // create comment
  async createOneComment(data, req) {
    try {
      // check id
      if (!isValidHex24(data.data.noteId)) {
        return this.sendError(new BadRequestError(MESSAGE.ERROR.VALIDATION.ID));
      }

      const _value = data.data.value?.trim();

      // check id
      if (!_value) {
        return this.sendError(
          new BadRequestError(MESSAGE.ERROR.BAD_REQUEST.SIMPLE),
        );
      }

      const comment = await commentSchema.create({
        owner: req.user._id,
        value: _value,
      });

      // check id
      if (!comment) {
        return this.sendError(new NotFoundError(MESSAGE.ERROR.NOT_FOUND.NOTE));
      }

      await noteSchema.findByIdAndUpdate(data.data.noteId, {
        $push: {
          comments: comment._id,
        },
      });

      return {
        type: this.type,
        action: 'create',
        statusCode: STATUS.INFO.CREATED,
        statusMessage: MESSAGE.INFO.CREATED.COMMENT,
        data: comment,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // update comment by id
  async updateOneCommentById(data, req) {
    try {
      // check id
      if (
        !isValidHex24(data.data.commentId) // comment id
      ) {
        return this.sendError(new BadRequestError(MESSAGE.ERROR.VALIDATION.ID));
      }

      const comment = await commentSchema.findOneAndUpdate(
        { _id: data.data.commentId, owner: req.user._id },
        { value: data.data.value, updateDate: new Date() },
        { new: true },
      );

      if (!comment) {
        throw new ForbiddenError(MESSAGE.ERROR.FORBIDDEN.COMMENT);
      }

      return {
        type: this.type,
        action: 'update',
        statusCode: STATUS.INFO.UPDATE,
        statusMessage: MESSAGE.INFO.UPDATE.COMMENT,
        data: comment,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // delete comment by id
  async deleteOneCommentById(data, req) {
    try {
      // check id
      if (
        !isValidHex24(data.data.commentId) // comment id
      ) {
        return this.sendError(new BadRequestError(MESSAGE.ERROR.VALIDATION.ID));
      }

      const comment = await commentSchema.findOneAndDelete(
        { _id: data.data.commentId, owner: req.user._id },
        { new: true },
      );

      await noteSchema.findByIdAndUpdate(
        data.data.noteId,
        { $pull: { comments: data.data.commentId } },
        { new: true },
      );

      return {
        type: this.type,
        action: 'delete',
        statusCode: STATUS.INFO.DELETE,
        statusMessage: MESSAGE.INFO.DELETE.COMMENT,
        data: comment,
      };
    } catch (err) {
      this.sendError(err);
    }
  }
}

module.exports = Comments;
