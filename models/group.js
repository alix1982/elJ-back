const mongoose = require('mongoose');
// const validator = require('validator');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  assigned: {
    type: Boolean,
    required: true,
  },
  dateStart: {
    type: Number,
    required: true,
  },
  dateEnd: {
    type: Number,
    required: true,
  },
  programm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'programm',
    required: true,
  },
});

module.exports = mongoose.model('group', groupSchema);
