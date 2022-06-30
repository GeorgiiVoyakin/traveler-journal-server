const { Schema, model } = require('mongoose');

const Note = new Schema({
  content: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  author: { type: String, ref: 'User', required: true },
});

Note.index({ latitude: 1, longitude: 1, author: 1 }, { unique: true });

module.exports = model('Note', Note);
