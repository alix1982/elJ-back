const mongoose = require('mongoose');
const validator = require('validator');

const victimSchema = new mongoose.Schema({
  countVictim: {
    type: Number,
    required: true,
    unique: true,
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
      health: {
        type: String,
      },
      statusVictim: {
        type: String,
      },

      // patronymic: {
      //   type: String,
      // },
      // blackList: {
      //   type: Boolean,
      // },
      // reasonBlackList: {
      //   type: String,
      // },
      // infoBlackList: {
      //   type: String,
      // },

      // street: {
      //   type: String,
      // },
      // house: {
      //   type: Number,
      // },
      // corpus: {
      //   type: String,
      // },
      // flat: {
      //   type: Number,
      // },

      // typeDocument: {
      //   type: String,
      // },
      // seriesDocument: {
      //   type: String,
      // },
      // numberDocument: {
      //   type: String,
      // },
      // issued: {
      //   type: String,
      // },
      // dateIssue: {
      //   type: Number,
      // },

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
