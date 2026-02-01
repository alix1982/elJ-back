const router = require('express').Router();

const { getEvents, createEvent, fixEvent, deleteEvent } = require('../controllers/event');
const { validationRouterCreateProgramm, validationRouterDeleteProgramm } = require('../validations/validationRouter');

router.get('/event', getEvents);

router.post('/event', createEvent);

router.patch('/event/updateEvent/:id', fixEvent);

router.delete('/event/:_id', deleteEvent);

module.exports = router;
