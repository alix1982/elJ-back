const mongoose = require('mongoose');
// const validator = require('validator');

const programmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
  },
  applies: {
    type: Boolean,
    required: true,
  },
  startTest: {
    time: { type: Number, required: true },
    passed: { type: Boolean, required: true },
  },
  blocks: {
    type: Object,
    required: true,
  },
  finallyTest: {
    time: { type: Number, required: true },
    passed: { type: Boolean, required: true },
  },
});

module.exports = mongoose.model('programm', programmSchema);
