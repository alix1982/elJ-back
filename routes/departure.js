const router = require('express').Router();
const { getDepartures, createDeparture, fixDeparture } = require('../controllers/departure');
const { validationRouterUpdateProgramm } = require('../validations/validationRouter');

router.get('/departures', getDepartures);

router.post('/departures/createDeparture', createDeparture);

router.patch('/departures/updateDeparture/:id', fixDeparture);

// router.post('/message/createUser', validationRouterCreateUserAdmin, createMessage);

// router.patch('/message/updateMessage/:id', validationRouterUpdateProgramm, fixMessage);

module.exports = router;
