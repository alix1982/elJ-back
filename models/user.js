const mongoose = require('mongoose');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3,
    // maxlength: 6,
    select: false,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    // unique: true,
    minlength: 2,
    maxlength: 50,
  },
  userName: {
    type: String,
    required: true,
    // unique: true,
    minlength: 2,
    maxlength: 50,
  }
});

module.exports = mongoose.model('user', userSchema);
