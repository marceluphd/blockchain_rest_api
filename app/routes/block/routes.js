const Router = require('express').Router();
const controller = require('./controller');

Router.route('/').post(controller.addStar);
Router.route('/all').get(controller.getAllBlocks);
Router.route('/height').get(controller.getBlockHeight);
Router.route('/validate_all').get(controller.validateBlockchain);
Router.route('/validate/:id').get(controller.validateBlock);
Router.route('/:height').get(controller.getByHeight);

module.exports = Router;
