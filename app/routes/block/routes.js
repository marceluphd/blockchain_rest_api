const Router = require('express').Router();
const controller = require('./controller');

Router.route('/').post(controller.addBlock);
Router.route('/height').get(controller.getBlockHeight);
Router.route('/validate_all').get(controller.validateBlockchain);
Router.route('/validate/:id').get(controller.validateBlock);
Router.route('/:id').get(controller.getBlock);

module.exports = Router;
