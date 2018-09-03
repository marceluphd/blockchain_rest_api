const db = require('../database/validation_db');

const Validation = () => ({
  saveRequest: resObj => db.saveRequest(resObj),
  saveUpdatedRequest: updatedResObj => db.saveUpdatedRequest(updatedResObj),
  getRequest: address => db.getRequest(address),
  deleteRequest: address => db.deleteRequest(address)
});

module.exports = Validation();
