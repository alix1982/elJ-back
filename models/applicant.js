const mongoose = require('mongoose');
const validator = require('validator');

const applicantSchema = new mongoose.Schema({
  countApplicant: {
    type: Number,
    required: true,
    unique: true,
  },
  isDeletedApplicant: {
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
      // blackList: {
      //   type: Boolean,
      // },
      reasonBlackList: {
        type: String,
      },
      infoBlackList: {
        type: String,
      },
      city: {
        type: String,
      },
      street: {
        type: String,
      },
      house: {
        type: Number,
      },
      corpus: {
        type: String,
      },
      flat: {
        type: Number,
      },
      typeDocument: {
        type: String,
      },
      seriesDocument: {
        type: String,
      },
      numberDocument: {
        type: String,
      },
      issued: {
        type: String,
      },
      dateIssue: {
        type: Number,
      },
      applicantDescription: {
        type: String,
      },
      nameUser: {
        type: String,
        required: true,
      }
    }
  ],
});

module.exports = mongoose.model('applicant', applicantSchema);
