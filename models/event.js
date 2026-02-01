const mongoose = require('mongoose');
const validator = require('validator');

const eventSchema = new mongoose.Schema({
  countEvent: {
    type: Number,
    required: true,
    unique: true,
  },
  isDeletedEvent: {
    type: Boolean,
    required: true
  },
  content: [
    {
      date: {
        type: Number,
        required: true,
      },
      dateActually: {
        type: Number,
        required: true,
      },
      nameEvent: {
        type: String,
        required: true,
      },
      descriptionEvent: {
        type: String,
        required: true,
      },
      listMessage: [
        {type: mongoose.Schema.Types.ObjectId},
      ],
      // lastname: {
      //   type: String,
      //   required: true,
      // },
      // firstname: {
      //   type: String,
      // },
      // patronymic: {
      //   type: String,
      // },
      // birthYear: {
      //   type: Number,
      // },
      // gender: {
      //   type: String,
      // },
      // health: {
      //   type: String,
      // },
      // statusVictim: {
      //   type: String,
      // },
      // victimDescription: {
      //   type: String,
      // },
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('event', eventSchema);
