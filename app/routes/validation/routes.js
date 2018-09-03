const Router = require('express').Router();
const controller = require('./controller');

Router.route('/requestValidation').post(controller.validateRequest);
Router.route('/message-signature/validate').post(controller.validateMsgSig);

module.exports = Router;
