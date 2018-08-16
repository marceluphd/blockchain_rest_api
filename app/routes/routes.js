const router = require('express').Router();

router.use('/block', require('./block/routes'));

module.exports = router;
