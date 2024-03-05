// Note.controller.js

// ? errors
const { BadRequestError, NotFoundError } = require('../errors/AllErrors');

// ? models
const userSchema = require('../models/user.model');
const noteSchema = require('../models/note.model');

// ? utils
const { STATUS, MESSAGE } = require('../utils/constants');

class Note {
  constructor({ sendError }) {
    this.type = 'note';
    this.sendError = sendError;

    // ? binding
    this.getAllNotes = this.getAllNotes.bind(this);
  }

  // create one notes
  async createOneNote(data, req) {
    try {
      // check value
      const _description = data.data.description?.trim();
      const _title = data.data.title?.trim();

      if (!_description || !_title) {
        return this.sendError(
          new BadRequestError(MESSAGE.ERROR.VALIDATION.SIMPLE),
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

  // todo create a function to update note

  // todo create a function to delete note

  // get all notes
  async getAllNotes(data, req) {
    try {
      const notes = await noteSchema.find({}).populate('comments');

      if (!notes) {
        throw new NotFoundError(MESSAGE.ERROR.NOT_FOUND.NOTES);
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
