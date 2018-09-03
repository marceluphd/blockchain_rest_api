const Router = require('express').Router();
const controller = require('./controller');

Router.route('/hash::hash').get(controller.getByHash);
Router.route('/address::address').get(controller.getByAddress);

module.exports = Router;
