const Note = require('../models/Note');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const check_required_fields = require('./utils/utils');
const { isValidObjectId, default: mongoose } = require('mongoose');

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

      const { title, content, latitude, longitude } = req.body;

      const note_data = {
        title,
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
      note
        .save()
        .then((note) =>
          res.status(201).json({ message: 'New note created', id: note.id })
        )
        .catch((err) => {
          if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(409).json({
              message:
                'Note with same combination of {user, latitude, longitude} already exists',
            });
          }
          return res
            .status(500)
            .json({ message: 'Error while creating new note ' + err });
        });
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: e.message });
      }
      return res
        .status(500)
        .json({ message: 'Some error while creating new note ' + e });
    }
  }

  async getAllByUser(req, res) {
    try {
      const { id } = req.body;
      const required_fields = ['id'];
      const isBadRequest = check_required_fields(req, required_fields);
      if (isBadRequest) {
        return res.status(400).json({
          message: `Some of the required fields: ${required_fields} are missing`,
        });
      }

      const notes = await Note.find({ author: id }).exec();
      return res.status(200).json(notes);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Failed to get notes for given user ' + e });
    }
  }

  async getAllNotesForCurrentUser(req, res) {
    try {
      const notes = await Note.find({ author: req.user.id }).exec();
      return res.status(200).json(notes);
    } catch (e) {
      return res
        .status(500)
        .json({ message: 'Failed to get notes for given user ' + e });
    }
  }

  async update(req, res) {
    try {
      const { title, content, latitude, longitude, id } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          message: `Invalid note id: ${id}`,
        });
      }

      const note_from_db = await Note.findById(id).exec();

      if (note_from_db !== null) {
        if (
          (await User.findById(note_from_db.author).exec())._id.toString() !==
          req.user.id
        ) {
          return res
            .status(403)
            .json({ message: 'Trying to update note for another user' });
        }

        if (title !== undefined) {
          note_from_db.title = title;
        }
        if (content !== undefined) {
          note_from_db.content = content;
        }
        if (latitude !== undefined) {
          note_from_db.latitude = latitude;
        }
        if (longitude !== undefined) {
          note_from_db.longitude = longitude;
        }
        await note_from_db.save();

        return res.status(200).json({ message: 'Note updated' });
      }
      return res.status(404).json({ message: 'Note does not exists' });
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
        await Note.deleteOne({ _id: id }).exec();
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
