const Note = require('../models/Note');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const check_required_fields = require('./utils/utils');
const { isValidObjectId } = require('mongoose');

class noteController {
  async create(req, res) {
    try {
      const required_fields = ['content', 'latitude', 'longitude'];
      const isBadRequest = check_required_fields(req, required_fields);

      if (isBadRequest) {
        return res.status(400).json({
          message: `Some of the required fields: ${required_fields} are missing`,
        });
      }

      const token = req.headers.authorization.split(' ')[1];
      const user_id = jwt.verify(token, process.env.jwtSecretKey).id;

      const { content, latitude, longitude } = req.body;
      const note_data = {
        content,
        latitude,
        longitude,
        author: user_id,
      };
      const note_from_db = await Note.findOne(note_data).exec();
      if (note_from_db) {
        return res.status(200).json({ message: 'Note already exists' });
      }
      const note = new Note(note_data);
      await note.save();
      return res.status(201).json({ message: 'New note created' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Some error while creating new note ' + e });
    }
  }

  async getAllByUser(req, res) {
    try {
    } catch (e) {}
  }

  async update(req, res) {
    try {
      const { content, latitude, longitude, author: username, id } = req.body;
      const required_fields = ['author', 'id'];
      const isBadRequest = check_required_fields(req, required_fields);
      if (isBadRequest) {
        return res.status(400).json({
          message: `Some of the required fields: ${required_fields} are missing`,
        });
      }

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          message: `Invalid note id: ${id}`,
        });
      }

      const note_from_db = await Note.findById(id).exec();
      console.log(note_from_db);

      if (note_from_db !== undefined) {
        if ((await User.findOne({ username: username }).exec()) === null) {
          return res
            .status(400)
            .json({ message: 'Trying to update note for not existing user' });
        }

        if (content !== undefined) {
        }
        if (latitude !== undefined) {
        }
        if (longitude !== undefined) {
        }
        return res.status(200).json({ message: 'Note updated' });
      }
      return res.status(200).json({ message: 'Note does not exists' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Some error while updating note ' + e });
    }
  }

  async remove(req, res) {
    try {
      const required_fields = ['id'];
      const isBadRequest = check_required_fields(req, required_fields);

      if (isBadRequest) {
        return res.status(400).json({
          message: `Some of the required fields: ${required_fields} are missing`,
        });
      }

      const id = req.body.id;
      const token = req.headers.authorization.split(' ')[1];
      const user_id = jwt.verify(token, process.env.jwtSecretKey).id;
      const note_from_db = await Note.findById(id)
        .where({ author: user_id })
        .exec();

      if (note_from_db) {
        await Note.deleteOne(note_from_db).exec();
        return res.status(200).json({ message: 'Note deleted' });
      }
      return res.status(200).json({ message: 'Note does not exists' });
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Some error while deleting note ' + e });
    }
  }
}

module.exports = new noteController();
