const router = require('express').Router();
const { validationRouterCreateQuestionnaireUser, validationRouterQuestion } = require('../validations/validationRouter');
const { createQuestionnaireUser, createQuestion } = require('../controllers/questionnaire');

router.post('/questionnaire', validationRouterCreateQuestionnaireUser, createQuestionnaireUser);

router.post('/question', validationRouterQuestion, createQuestion);

module.exports = router;
