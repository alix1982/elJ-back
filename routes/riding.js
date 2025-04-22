const router = require('express').Router();
const { getRidings, createRiding, fixRiding } = require('../controllers/riding');
const { validationRouterUpdateProgramm } = require('../validations/validationRouter');

router.get('/ridings', getRidings);

router.post('/ridings/createRiding', createRiding);

router.patch('/ridings/updateRiding/:id', fixRiding);

// router.post('/message/createUser', validationRouterCreateUserAdmin, createMessage);

// router.patch('/message/updateMessage/:id', validationRouterUpdateProgramm, fixMessage);

module.exports = router;
