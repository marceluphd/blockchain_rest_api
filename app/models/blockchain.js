const db = require('../database/level_db');
const { Block } = require('./block');

class Blockchain {
  constructor() {
    db.addGenesisBlock(new Block('First block in the chain - Genesis block'));
  }

  addBlock(newBlock) {
    return db.addDataToLevelDB(newBlock);
  }

  getBlockHeight() {
    return db.getBlockHeight();
  }

  getBlock(key) {
    return db.getLevelDBData(key);
  }

  validateChain() {
    return db.validateChain();
  }

  validateBlock(key) {
    return db.validateBlock(key);
  }

  getAllBlocks() {
    return db.getAllBlocks();
  }

  // For testing purpose, modify a block to be invalid
  modifyBlock(key) {
    return db.modifyBlock(key);
  }
}

module.exports = {
  Blockchain
};
