const mongoose = require('mongoose');

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
      },
      listMessage: [
        {type: mongoose.Schema.Types.ObjectId},
      ],
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('event', eventSchema);
