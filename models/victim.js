const mongoose = require('mongoose');
const validator = require('validator');

const victimSchema = new mongoose.Schema({
  countVictim: {
    type: Number,
    required: true,
    unique: true,
  },
  isDeletedVictim: {
    type: Boolean,
    required: true
  },
  content: [
    {
      dateActually: {
        type: Number,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      firstname: {
        type: String,
      },
      patronymic: {
        type: String,
      },
      birthYear: {
        type: Number,
      },
      gender: {
        type: String,
      },
      statusVictim: {
        type: String,
      },
      victimDescription: {
        type: String,
      },
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('victim', victimSchema);
