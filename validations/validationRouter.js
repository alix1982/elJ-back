const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { mesErrCelebratePhone400 } = require('../utils/messageServer');

// валидация роута авторизации
module.exports.validationRouterLogin = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    password: Joi.string().required().min(1).max(20),
    snils: Joi.string().min(11).max(11),
  }),
});

// валидация роутов без авторизации
module.exports.validationRouterCreateQuestionnaireUser = celebrate({
  body: Joi.object().keys({
    emailRequst: Joi.string().email().required(),
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    patronymic: Joi.string().required().min(2).max(50),
    workName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .required()
      .custom((values, helpers) => {
        if (validator.isMobilePhone(values)) {
          return values;
        }
        return helpers.message(mesErrCelebratePhone400);
      }),
    postWork: Joi.string().required().min(2).max(50),
    postGoAndChs: Joi.string().required().min(2).max(50),
    // yearPreviousQualification: Joi.number().required().min(1950).max(2100),
    birthdate: Joi.date().required().timestamp('unix').min('1950-01-01').max('2010-12-31'),
    education: Joi.string().required().min(2).max(50),
    snils: Joi.string().required().min(11).max(11),
    citizenship: Joi.string().required().min(2).max(50),
    consentProcessingPersonalData: Joi.boolean().required().default(false),
  }),
});

module.exports.validationRouterQuestion = celebrate({
  body: Joi.object().keys({
    emailRequst: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .required()
      .custom((values, helpers) => {
        if (validator.isMobilePhone(values)) {
          return values;
        }
        return helpers.message(mesErrCelebratePhone400);
      }),
    question: Joi.string().required().min(2).max(1000),
  }),
});

// валидация роутов анкет для администратора
module.exports.validationRouterCreateQuestionnaireAdmin = celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    patronymic: Joi.string().required().min(2).max(50),
    workName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .required()
      .custom((values, helpers) => {
        if (validator.isMobilePhone(values)) {
          return values;
        }
        return helpers.message(mesErrCelebratePhone400);
      }),
    postWork: Joi.string().required().min(2).max(50),
    postGoAndChs: Joi.string().required().min(2).max(50),
    // yearPreviousQualification: Joi.number().required().min(1950).max(2100),
    // birthdate: Joi.date().required().timestamp('unix'),
    birthdate: Joi.date().required().timestamp('unix').min('1950-01-01').max('2010-12-31'),
    education: Joi.string().required().min(2).max(50),
    snils: Joi.string().required().min(11).max(11),
    citizenship: Joi.string().required().min(2).max(50),
    // isModeration: Joi.boolean().required().default(false),
    consentProcessingPersonalData: Joi.boolean().required().default(false),
  }),
});

module.exports.validationRouterFixQuestionnaireAdmin = celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    patronymic: Joi.string().min(2).max(50),
    workName: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().custom((values, helpers) => {
      if (validator.isMobilePhone(values)) {
        return values;
      }
      return helpers.message(mesErrCelebratePhone400);
    }),
    postWork: Joi.string().min(2).max(50),
    postGoAndChs: Joi.string().min(2).max(50),
    // yearPreviousQualification: Joi.number().min(1950).max(2100),
    birthdate: Joi.date().timestamp('unix'),
    // birthdate: Joi.date().timestamp('unix').min('1950-01-01').max('2010-12-31'),
    education: Joi.string().min(2).max(50),
    snils: Joi.string().min(11).max(11),
    citizenship: Joi.string().min(2).max(50),
  }),
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterFixModerationQuestionnaireAdmin = celebrate({
  body: Joi.object().keys({
    isModeration: Joi.boolean().required(),
  }),
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterDeleteQuestionnaireAdmin = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

// валидация роутов пользователей для администратора
module.exports.validationRouterCreateUserAdmin = celebrate({
  body: Joi.object().keys({
    snils: Joi.string().required().min(11).max(11),
  }),
});

module.exports.validationRouterAddGroupUserAdmin = celebrate({
  body: Joi.object().keys({
    groupName: Joi.string().min(2).max(50).required(),
  }),
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterDeleteGroupUserAdmin = celebrate({
  body: Joi.object().keys({
    groupId: Joi.string().required().hex().length(24),
  }),
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterDeleteUserAdmin = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

// валидация роутов пользователей
module.exports.validationRouterUpdateProgramm = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
  body: Joi.object().keys({
    thema: Joi.number().required().min(0).max(10),
    block: Joi.number().required().min(0).max(10),
    keyChange: Joi.string().required().min(1).max(20),
  }),
});

// валидация роутов программ для администратора
module.exports.validationRouterCreateProgramm = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    blockCount: Joi.number().required().min(1).max(10),
    themaCount: Joi.array().items(Joi.number().min(1).max(10)).required(),
  }),
});

module.exports.validationRouterDeleteProgramm = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

// валидация роутов групп для администратора
module.exports.validationRouterCreateGroup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    dateStart: Joi.date().required().timestamp('unix'),
    dateEnd: Joi.date().required().timestamp('unix'),
    programmName: Joi.string().required().min(2).max(50),
  }),
});

module.exports.validationRouterGroupUserData = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationRouterDeleteGroup = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

// module.exports.validationRouterCreateMovie = celebrate({
//   body: Joi.object().keys({
//     trailerLink: Joi.string().required().custom((values, helpers) => {
//       if (validator.isURL(values)) { return values; }
//       return helpers.message(mesErrCelebrateTrailerLink400);
//     }),
//   }),
// });
