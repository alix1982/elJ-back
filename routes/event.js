const router = require('express').Router();

const { getEvents, createEvent, fixEvent, deleteEvent, fixMessageEvent } = require('../controllers/event');
const { validationRouterCreateProgramm, validationRouterDeleteProgramm } = require('../validations/validationRouter');

router.get('/events', getEvents);

router.post('/event', createEvent);

router.patch('/event/updateEvent/:id', fixEvent);

router.patch('/event/updateMessageEvent/:idMes', fixMessageEvent);

router.delete('/event/:_id', deleteEvent);

module.exports = router;
