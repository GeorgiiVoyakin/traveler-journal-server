const { Schema, model } = require('mongoose');

const Note = new Schema({
  title: { type: String, default: 'Title' },
  content: { type: String },
  latitude: { type: Number, required: true, max: 90, min: -90 },
  longitude: { type: Number, required: true, max: 180, min: -180 },
  author: { type: String, ref: 'User', required: true },
});

Note.index({ latitude: 1, longitude: 1, author: 1 }, { unique: true });

module.exports = model('Note', Note);
