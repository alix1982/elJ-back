const router = require('express').Router();

const {
  validationRouterCreateApplicant,
  validationRouterDeleteApplicant,
  validationRouterApplicant,
} = require('../validations/validationRouter');

const { getApplicants, createApplicant, deleteApplicant, getApplicant, fixApplicant } = require('../controllers/applicant');

router.get('/applicants', getApplicants);

// router.get('/applicant/:_id', getApplicant);

router.post('/applicant', createApplicant);

router.patch('/applicant/updateApplicant/:id', fixApplicant);

// router.delete('/applicant/:_id', validationRouterDeleteApplicant, deleteApplicant);

module.exports = router;
