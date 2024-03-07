// Note.controller.js

// ? errors
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/AllErrors');

// ? models
const userSchema = require('../models/user.model');
const noteSchema = require('../models/note.model');

// ? utils
const { STATUS, MESSAGE } = require('../utils/constants');
const { isValidHex24 } = require('../utils/utils');

class Note {
  constructor({ sendError }) {
    this.type = 'note';
    this.sendError = sendError;

    // ? binding
    this.getAllNotes = this.getAllNotes.bind(this);
    this.setReactionToNoteById = this.setReactionToNoteById.bind(this);
    this.deleteReactionToNoteById = this.deleteReactionToNoteById.bind(this);
  }

  // create one notes
  async createOneNote(data, req) {
    try {
      // check value
      const _description = data.data.description?.trim();
      const _title = data.data.title?.trim();

      if (!_description || !_title) {
        return this.sendError(
          new BadRequestError({
            type: this.type,
            action: 'create',
            method: '',
            errMessage: MESSAGE.ERROR.VALIDATION.SIMPLE,
          }),
        );
      }

      const note = await noteSchema.create({
        title: _title,
        owner: req.user._id,
        description: _description,
        images: data.data.photos || [],
      });

      // add noteId to users notes
      await userSchema.findByIdAndUpdate(req.user._id, {
        $push: {
          notes: note._id,
        },
      });

      return {
        type: this.type,
        action: 'create',
        statusCode: STATUS.INFO.CREATED,
        statusMessage: MESSAGE.INFO.CREATED.NOTE,
        data: note,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // set action
  async setReactionToNoteById(data, req) {
    try {
      // check id
      if (!isValidHex24(data.data.noteId)) {
        throw new BadRequestError({
          type: this.type,
          action: 'reaction',
          method: 'set',
          errMessage: MESSAGE.ERROR.VALIDATION.ID,
        });
      }

      // add userID to notes likes
      const note = await noteSchema.findById(data.data.noteId);

      if (note.likes.includes(req.user._id)) {
        throw new ForbiddenError({
          type: this.type,
          action: 'reaction',
          method: 'set',
          errMessage: MESSAGE.ERROR.FORBIDDEN.REACTION.SET,
        });
      }

      note.likes.push(req.user._id);

      note.save();

      return {
        type: this.type,
        action: 'reaction',
        method: 'set',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.PUT.REACTION,
        data: note,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // delete action
  async deleteReactionToNoteById(data, req) {
    try {
      // check id
      if (!isValidHex24(data.data.noteId)) {
        throw new BadRequestError({
          type: this.type,
          action: 'reaction',
          method: 'delete',
          errMessage: MESSAGE.ERROR.VALIDATION.ID,
        });
      }

      // try to delete userID from notes likes
      const note = await noteSchema.findOneAndUpdate(
        { _id: data.data.noteId, likes: { $in: [req.user._id] } },
        {
          $pull: {
            likes: req.user._id,
          },
        },
        { new: true },
      );

      if (!note) {
        throw new ForbiddenError({
          type: this.type,
          action: 'reaction',
          method: 'delete',
          errMessage: MESSAGE.ERROR.FORBIDDEN.REACTION.SET,
        });
      }

      return {
        type: this.type,
        action: 'reaction',
        method: 'delete',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.DELETE.REACTION,
        data: note,
      };
    } catch (err) {
      this.sendError(err);
    }
  }

  // todo create a function to update note

  // todo create a function to delete note

  // get all notes
  async getAllNotes(data, req) {
    try {
      const notes = await noteSchema.find({}).populate('comments');

      if (!notes) {
        throw new NotFoundError({
          type: this.type,
          action: 'get',
          method: 'all',
          errMessage: MESSAGE.ERROR.NOT_FOUND.NOTES,
        });
      }

      return {
        type: this.type,
        action: 'get',
        method: 'all',
        statusCode: STATUS.INFO.OK,
        statusMessage: MESSAGE.INFO.GET.NOTES,
        data: notes,
      };
    } catch (err) {
      this.sendError(err);
    }
  }
}

module.exports = Note;
