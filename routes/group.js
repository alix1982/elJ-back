const router = require('express').Router();

const {
  validationRouterCreateGroup,
  validationRouterDeleteGroup,
  validationRouterGroupUserData,
} = require('../validations/validationRouter');

const { getGroups, createGroup, deleteGroup, getGroup, fixGroup } = require('../controllers/group');

router.get('/groups', getGroups);

router.get('/group/:_id', validationRouterGroupUserData, getGroup);

router.post('/group', createGroup);

router.patch('/group/updateGroup/:id', fixGroup);

router.delete('/group/:_id', validationRouterDeleteGroup, deleteGroup);

module.exports = router;
