const level = require('level');

const blockchainDB = './blockchainDB';
const db = level(blockchainDB);

const validationDB = './validationDB';
const rdb = level(validationDB);

module.exports = {
  connect: () => db,
  connectValidation: () => rdb
};
