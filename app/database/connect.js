const level = require('level');

const blockchainDB = './blockchainDB';
const db = level(blockchainDB);

module.exports = {
  connect: () => db
};
