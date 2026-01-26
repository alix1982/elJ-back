const router = require('express').Router();

const {
  validationRouterCreateApplicant,
  validationRouterDeleteApplicant,
  validationRouterApplicant,
} = require('../validations/validationRouter');

const { deleteVictim, getVictim, getVictims, fixVictim, createVictim } = require('../controllers/victim');

router.get('/victims', getVictims);

// router.get('/applicant/:_id', getApplicant);

router.post('/victim', createVictim);

router.patch('/victim/updateVictim/:id', fixVictim);

// router.delete('/applicant/:_id', validationRouterDeleteApplicant, deleteApplicant);

module.exports = router;
