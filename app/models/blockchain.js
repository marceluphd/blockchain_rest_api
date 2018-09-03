const db = require('../database/level_db');

const Blockchain = () => ({
  getAllBlocks: () => db.getAllBlocks(),
  getBlockHeight: () => db.getBlockHeight(),
  addGenesisBlock: () => db.addGenesisBlock(),
  getByHeight: height => db.getByHeight(height),
  addBlock: body => db.addBlock(body),
  validateBlock: key => db.validateBlock(key),
  validateBlockchain: () => db.validateBlockchain(),
  saveRequest: resObj => db.saveRequest(resObj),
  getByAddress: address => db.getByAddress(address),
  getByHash: hash => db.getByHash(hash)
});

module.exports = Blockchain();
