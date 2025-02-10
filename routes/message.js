const router = require('express').Router();
const { getMessages, createMessage, fixMessage } = require('../controllers/message');
const { validationRouterUpdateProgramm } = require('../validations/validationRouter');

router.get('/message', getMessages);

router.post('/message/createMessage', createMessage);

router.patch('/message/updateMessage/:id', fixMessage);

// router.post('/message/createUser', validationRouterCreateUserAdmin, createMessage);

// router.patch('/message/updateMessage/:id', validationRouterUpdateProgramm, fixMessage);

module.exports = router;
