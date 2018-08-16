const Router = require('express').Router();
const controller = require('./controller');

Router.route('/').post(controller.addBlock);

Router.route('/:id').get(controller.getBlock);

module.exports = Router;
