const Note = require('../models/Note');
const User = require('../models/User');
 
class noteController {
  async create(req, res) {
    try {
      const { content, latitude, longitude, author } = req.body;
      const note = new Note({ content, latitude, longitude, author });
      const note_from_db = Note.findOne({ note });
      if (note_from_db) {
        return res.status(200).json({ message: 'Note already exists' });
      }
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
      const id = req.params.id;
      const { content, latitude, longitude, author } = req.body;
        const note_from_db = Note.findById(id);
      if (note_from_db !== undefined) {
          console.log(content);
          console.log(latitude);
          console.log(longitude);
          console.log(author);
        if (author!== undefined) {
            console.log(User.findById(author));
            if (User.findById(author) === undefined) {
        return res.status(400).json({ message: 'Trying to update note for not existing user' });
            }
        }
        if (content !== undefined) {
        }
        if (latitude !== undefined) {
        }
        if (longitude!== undefined) {
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
      const id = req.body.id;
      const note_from_db = Note.findById(id);
      if (note_from_db) {
        Note.deleteOne(note_from_db);
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
