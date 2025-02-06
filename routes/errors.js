const router = require('express').Router();
const NoDate_404 = require('../errors/404-noDate');
const { mesErrRouterErrors404 } = require('../utils/messageServer');

router.use((req, res, next) => {
  next(new NoDate_404(mesErrRouterErrors404));
});

module.exports = router;
