const SHA256 = require('crypto-js/sha256');

const Block = require('../models/block');
const { generateTimestamp } = require('../helpers/helpers');
const db = require('./connect').connect();

/**
 * GETTER
 */

async function getAllBlocksFromDB(blockHeight) {
  const blocks = [];
  for (let i = 0; blockHeight > i; i++) {
    const data = await db.get(i);
    const block = JSON.parse(data);
    blocks.push(block);
  }
  return blocks;
}

function getByAddress(address) {
  let foundBlock;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', (data) => {
        if (data && data.value) {
          const block = JSON.parse(data.value);
          if (block && block.body && block.body.address === address) {
            foundBlock = block;
            resolve(foundBlock);
          }
        }
      })
      .on('error', err => reject(err))
      .on('close', () => resolve(foundBlock));
  });
}

function getByHash(hash) {
  let foundBlock;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', (data) => {
        if (data && data.value) {
          const block = JSON.parse(data.value);
          if (block && block.hash === hash) {
            foundBlock = block;
            resolve(foundBlock);
          }
        }
      })
      .on('error', err => reject(err))
      .on('close', () => resolve(foundBlock));
  });
}

async function getByHeight(key) {
  try {
    const block = await db.get(key);
    return JSON.parse(block);
  } catch (err) {
    throw err;
  }
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

function getBlockHeight() {
  let blockHeight = -1;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', err => reject(err))
      .on('close', () => resolve(blockHeight));
  });
}

/**
 * VALIDATE BLOCK(S)
 */

async function validateBlock(blockHeight) {
  try {
    const block = await getByHeight(blockHeight);
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

/**
 * INSERT BLOCK
 */

async function addBlockToDB(blockHeight, blockData) {
  const block = blockData;
  block.height = blockHeight;
  block.time = generateTimestamp();

  if (blockHeight > 0) {
    const prevHash = JSON.parse(await db.get(blockHeight - 1)).hash;
    block.previousBlockHash = prevHash;
  }

  // Encode and decode story
  if (block.body && block.body.star && block.body.star.story) {
    const encodedStroy = Buffer.from(block.body.star.story, 'utf8').toString('hex');
    block.body.star.story = encodedStroy;
    block.body.star.storyDecoded = Buffer.from(encodedStroy, 'hex').toString('utf8');
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

async function addBlock(body) {
  try {
    const currentBlockHeight = await getBlockHeight();
    const block = new Block(body);
    return addBlockToDB(currentBlockHeight + 1, block);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getByAddress,
  getByHash,
  getByHeight,
  getBlockHeight,
  getAllBlocks,
  validateBlock,
  validateBlockchain,
  addGenesisBlock,
  addBlock
};
