const SHA256 = require('crypto-js/sha256');

const Block = require('../models/block');
const db = require('./connect').connect();

async function getAllBlocksFromDB(blockHeight) {
  const blocks = [];
  for (let i = 0; blockHeight > i; i++) {
    const data = await db.get(i);
    const block = JSON.parse(data);
    blocks.push(block);
  }
  return blocks;
}

function getAllBlocks() {
  let blockHeight = 0;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', err => reject(err))
      .on('close', () => resolve(getAllBlocksFromDB(blockHeight)));
  });
}

async function addBlockToDB(blockHeight, blockData) {
  const block = blockData;
  block.height = blockHeight;
  block.time = new Date()
    .getTime()
    .toString()
    .slice(0, -3);

  if (blockHeight > 0) {
    const prevHash = JSON.parse(await db.get(blockHeight - 1)).hash;
    block.previousBlockHash = prevHash;
  }

  block.hash = SHA256(JSON.stringify(block)).toString();

  return new Promise((resolve, reject) => {
    db.put(blockHeight, JSON.stringify(block))
      .then(() => db.get(blockHeight))
      .then(data => resolve(JSON.parse(data)))
      .catch(err => reject(err));
  });
}

function addGenesisBlock() {
  return addBlockToDB(0, new Block('First block in the chain - Genesis block'));
}

async function getBlock(key) {
  try {
    const block = await db.get(key);
    return JSON.parse(block);
  } catch (err) {
    throw err;
  }
}

function getBlockHeight() {
  let blockHeight = -1;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', err => reject(err))
      .on('close', () => resolve(blockHeight));
  });
}

async function addBlock(body) {
  try {
    const currentBlockHeight = await getBlockHeight();
    const block = new Block(body);
    return addBlockToDB(currentBlockHeight + 1, block);
  } catch (err) {
    throw err;
  }
}

async function validateBlock(blockHeight) {
  try {
    const block = await getBlock(blockHeight);
    const blockHash = block.hash;
    block.hash = '';
    const isValid = blockHash === SHA256(JSON.stringify(block)).toString();
    return isValid;
  } catch (err) {
    throw err;
  }
}

async function validateAllBlocks(blockHeight) {
  const errors = [];
  try {
    for (let height = 0; blockHeight > height; height++) {
      if (!(await validateBlock(height))) {
        errors.push(height);
      }
    }

    if (errors.length > 0) {
      throw errors;
    }

    return { isValid: true };
  } catch (err) {
    return { isValid: false, errors: err };
  }
}

function validateBlockchain() {
  let blockHeight = 0;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', err => reject(err))
      .on('close', () => resolve(validateAllBlocks(blockHeight)));
  });
}

module.exports = {
  getBlockHeight,
  getBlock,
  validateBlockchain,
  getAllBlocks,
  addGenesisBlock,
  validateBlock,
  addBlock
};
