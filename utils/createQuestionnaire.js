const ConflictData_409 = require('../errors/409-conflictData');
const IncorrectData_400 = require('../errors/400-incorrectData');
const Questionnaire = require('../models/questionnaire');
const { mesErrConflictQuestionnaire409, mesErrValidationQuestionnaire400, mesQuestion, mesErrEmailSending400, mesQuestionAndEmail, mesErrQuestionnaire404, mesQuestionnaire } = require('./messageServer');
const calcDate = require('./translationDate');
const NoDate_404 = require('../errors/404-noDate');
const sendEmail = require('./sendEmail');

const createQuestionnaire = (req, res, next, isEmail=false) => {

  const {
    emailRequst, firstName, lastName, patronymic, workName, email, phone, postWork, postGoAndChs, // yearPreviousQualification,
    birthdate, education, snils, citizenship, consentProcessingPersonalData,
  } = req.body;

  let isSend = false;

  // готовим данные для отправки на почту
  const options = {
    to: emailRequst,
    subject: 'Новая анкета',
    html: `
      <h1>Фамилия: ${firstName}</h1>
      <p>Имя: ${lastName}</p>
      <p>Отчество: ${patronymic}</p>
      <p>Место работы: ${workName}</p>
      <p>Почта: ${email}</p>
      <p>Телефон: ${phone}</p>
      <p>Должность: ${postWork}</p>
      <p>Должность по ГОиЧС: ${postGoAndChs}</p>
      <p>Дата рождения: ${calcDate(birthdate)}</p>
      <p>Образование: ${education}</p>
      <p>СНИЛС: ${snils}</p>
      <p>Гражданство: ${citizenship}</p>
      <p>Согласие на обработку персональных данных: ${consentProcessingPersonalData ? 'Есть' : 'Нет'}</p>
      `,
  };

  Questionnaire.create({
    firstName, lastName, patronymic, workName, email, phone, postWork, postGoAndChs,
    // yearPreviousQualification,
    // birthdate: Math.floor(new Date('2023-01-01').getTime() / 1000),
    birthdate, education, snils, citizenship, isModeration: false, consentProcessingPersonalData,
  })
    .then(async (questionnaire) => {

      isEmail ?
        (isSend = await sendEmail(options, isSend)) :
        isSend = true;

      isSend ?
        res.send({questionnaire, message: isEmail ? mesQuestionAndEmail : mesQuestionnaire}) :
        res.send({questionnaire, message: mesErrEmailSending400});
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationQuestionnaire400));
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrQuestionnaire404));
        return;
      }
      if (err.code === 11000) {
        return next(new ConflictData_409(mesErrConflictQuestionnaire409));
      }
      next(err);
    });
};

module.exports = createQuestionnaire;
