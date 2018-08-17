const db = require('../database/level_db');

const Blockchain = () => ({
  getAllBlocks: () => db.getAllBlocks(),
  getBlockHeight: () => db.getBlockHeight(),
  addGenesisBlock: () => db.addGenesisBlock(),
  getBlock: key => db.getBlock(key),
  addBlock: body => db.addBlock(body),
  validateBlock: key => db.validateBlock(key),
  validateBlockchain: () => db.validateBlockchain()
});

module.exports = Blockchain();
