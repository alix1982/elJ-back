const Questionnaire = require('../models/questionnaire');
const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const ConflictData_409 = require('../errors/409-conflictData');

const {
  mesErrNoQuestionnaire404,
  mesErrIdQuestionnaire400,
  mesErrConflictQuestionnaire409,
  mesFixQuestionnaire,
  mesModerationQuestionnaireCompleted,
  mesModerationQuestionnaireCancelled,
  mesErrValidationQuestionnaire400,
} = require('../utils/messageServer');
const createQuestionnaire = require('../utils/createQuestionnaire');

module.exports.getQuestionnairesAdmin = (req, res, next) => {
  Questionnaire.find({})
    .then((questionnaires) => {
      if (questionnaires.length === 0) {
        throw new NoDate_404(mesErrNoQuestionnaire404);
      }
      res.send(questionnaires);
    })
    .catch(next);
};

module.exports.createQuestionnaireAdmin = createQuestionnaire;

module.exports.patchQuestionnaireAdmin = (req, res, next) => {
  const {
    firstName,
    lastName,
    patronymic,
    workName,
    email,
    phone,
    postWork,
    postGoAndChs,
    // yearPreviousQualification,
    birthdate,
    education,
    snils,
    citizenship,
  } = req.body;
  Questionnaire.findById(req.params._id)
    .then((questionnaire) => {
      if (questionnaire === null) {
        throw new NoDate_404(mesErrNoQuestionnaire404);
      }
      return questionnaire.updateOne(
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            patronymic: patronymic,
            workName: workName,
            email: email,
            phone: phone,
            postWork: postWork,
            postGoAndChs: postGoAndChs,
            birthdate: birthdate,
            education: education,
            snils: snils,
            citizenship: citizenship,
          },
        },
        { new: true, runValidators: true }
      );
    })
    .then((questionnaire) => {
      // формирование ответа при успешном (или неудачном) изменении анкеты
      if (questionnaire.acknowledged === true) {
        return res.send({ message: mesFixQuestionnaire });
      } else {
        return res.send(questionnaire);
      }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdQuestionnaire400));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationQuestionnaire400));
      }
      if (err.code === 11000) {
        return next(new ConflictData_409(mesErrConflictQuestionnaire409));
      }
      next(err);
    });
};

module.exports.patchQuestionnaireAdminModeration = (req, res, next) => {
  const { isModeration } = req.body;
  Questionnaire.findById(req.params._id)
    .then((questionnaire) => {
      if (questionnaire === null) {
        throw new NoDate_404(mesErrNoQuestionnaire404);
      }
      // изменение статуса модерации анкеты
      return questionnaire.updateOne({ $set: { isModeration: isModeration } }, { new: true, runValidators: true });
    })
    .then((questionnaire) => {
      // формирование ответа при успешном (или неудачном) изменения статуса модерации анкеты
      if (questionnaire.acknowledged === true) {
        return res.send(
          isModeration ? { message: mesModerationQuestionnaireCompleted } : { message: mesModerationQuestionnaireCancelled }
        );
      } else {
        return res.send(questionnaire);
      }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdQuestionnaire400));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationQuestionnaire400));
      }
      next(err);
    });
};

module.exports.deleteQuestionnaireAdmin = (req, res, next) => {
  Questionnaire.findById(req.params._id)
    .then((questionnaire) => {
      if (questionnaire === null) {
        throw new NoDate_404(mesErrNoQuestionnaire404);
      }
      return questionnaire.remove();
    })
    .then((questionnaire) => res.send(questionnaire))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdQuestionnaire400));
        return;
      }
      next(err);
    });
};
