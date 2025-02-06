const Questionnaire = require('../models/questionnaire');
const IncorrectData_400 = require('../errors/400-incorrectData');

const {
  mesErrNoEmailSending400,
  mesQuestion,
  mesErrEmailSending400,
  mesQuestionAndEmail,
  mesErrNoQuestion,
  mesErrValidationQuestionnaire400,
  mesErrNoProgramm404,
  mesErrEmailSendingQuestion400,
} = require('../utils/messageServer');

const createQuestionnaire = require('../utils/createQuestionnaire');
const sendEmail = require('../utils/sendEmail');
const calcDate = require('../utils/translationDate');
const NoDate_404 = require('../errors/404-noDate');

module.exports.createQuestionnaireUser = async (req, res, next) => {
  // добавляем пользователя в базу с отправкой письма на почту
  try {
    createQuestionnaire(req, res, next, true)
  } catch (err) {
    console.log(err);
    if (err.message === 'No recipients defined') {
      next(new IncorrectData_400(mesErrNoEmailSending400));
      return err;
    }
    next(err);
  }
};

module.exports.createQuestion = async (req, res, next) => {
  let isSend = false;

  try {
    const { emailRequst, name, phone, email, question } = req.body;

    // готовим данные для отправки на почту
    const options = {
      to: emailRequst,
      subject: 'Вопрос',
      html: `
        <h1>Имя: ${name}</h1>
        <p>Телефон: ${phone}</p>
        <p>Почта: ${email}</p>
        <p>Вопрос: ${question}</p>
      `,
    };

    // отправляем данные на почту
    isSend = await sendEmail(options, isSend);
    isSend ?
      res.send({ message: mesQuestion }) :
      next(new IncorrectData_400(mesErrEmailSendingQuestion400));
    // try {
    //   await sendEmail(options);
    //   res.send({ message: mesQuestion });
    // } catch (err) {
    //   console.log(err);
    //   next(new IncorrectData_400(mesErrEmailSendingQuestion400));
    // }
    // res.status(200).json({
    //   message: 'Check your mail!',
    // });
  } catch (err) {
    console.log(err);
    if (err.message === 'No recipients defined') {
      next(new IncorrectData_400(mesErrNoEmailSending400));
      return err;
    }
    next(err);
  }
};
