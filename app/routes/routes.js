const router = require('express').Router();

router.use(require('./validation/routes'));
router.use('/block', require('./block/routes'));
router.use('/stars', require('./star/routes'));

module.exports = router;
