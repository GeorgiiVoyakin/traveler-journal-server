const Note = require('../models/Note');

class noteController {
  async create(req, res) {
    try {
      const { content, latitude, longitude, author } = req.body;
      const note = new Note({ content, latitude, longitude, author });
      note_from_db = Note.findOne({ note });
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
}

module.exports = new noteController();
