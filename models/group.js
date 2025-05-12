const mongoose = require('mongoose');
// const validator = require('validator');

const groupSchema = new mongoose.Schema({
  countGroup: {
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
      nameGroup: {
        type: String,
        required: true,
      },
      time: {
        dateStartGroup: {
          type: Number,
          required: true,
        },
        dateEndGroup: {
          type: Number,
          required: true,
        },
      },
      groupDescription: {
        type: String,
      },
      // message: {
      //   type: Number,
      //   required: true,
      // },

      elderPSG: [{
        text: {
          type: String,
          required: true,
        },
        duty: {
          type: Boolean,
        },
        elder: {
          type: Boolean,
        },
        driver: {
          type: Boolean,
        },
      }],
      technicPSO: [{
        text: {
          type: String,
        },
        // duty: {
        //   type: Boolean,
        // },
        // elder: {
        //   type: Boolean,
        // },
        // driver: {
        //   type: Boolean,
        // },
      }],
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('group', groupSchema);
