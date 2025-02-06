const mongoose = require('mongoose');
const validator = require('validator');

const questionnaireSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  patronymic: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  workName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    validate: validator.isEmail,
    required: true,
  },
  phone: {
    type: String,
    validate: validator.isMobilePhone,
    required: true,
  },
  postWork: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  postGoAndChs: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  // удалить после чистки базы
  yearPreviousQualification: {
    type: Number,
    // required: true,
    minlength: 4,
    maxlength: 4,
  },
  birthdate: {
    type: Number,
    required: true,
    min: -631152000000,
    max: 1293753600000,
  },
  education: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  snils: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
    unique: true,
  },
  citizenship: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  isModeration: {
    type: Boolean,
    required: true,
  },
  consentProcessingPersonalData: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('questionnaire', questionnaireSchema);
