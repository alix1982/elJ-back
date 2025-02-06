const router = require('express').Router();

const {
  validationRouterCreateGroup,
  validationRouterDeleteGroup,
  validationRouterGroupUserData,
} = require('../validations/validationRouter');

const { getGroups, createGroup, deleteGroup, getGroupUserData } = require('../controllers/group');

router.get('/group', getGroups);

router.get('/group/:_id', validationRouterGroupUserData, getGroupUserData);

router.post('/group', validationRouterCreateGroup, createGroup);

router.delete('/group/:_id', validationRouterDeleteGroup, deleteGroup);

module.exports = router;
