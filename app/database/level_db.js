const level = require('level');

const blockchainDB = './blockchainDB';
const db = level(blockchainDB);

const SHA256 = require('crypto-js/sha256');

// Add data to levelDB with key/value pair
async function addLevelDBData(blockHeight, blockData) {
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

  await db
    .put(blockHeight, JSON.stringify(block))
    .then(() => db.get(blockHeight))
    .then(data => console.log('\nAdded: ', data))
    .catch(err => console.error('Failed to add. ', err));
}

// Get block height
function getBlockHeight() {
  let blockHeight = -1;

  db.createReadStream()
    .on('data', () => blockHeight++)
    .on('close', () => console.log(`\nBlock height : ${blockHeight}`));
}

// Get data from levelDB with key
async function getLevelDBData(key) {
  try {
    const result = await db.get(key);
    const data = JSON.parse(result);
    console.log(`\nBlock(key: ${key}): `, data);
    return result;
  } catch (err) {
    console.error('Not found', err);
    return err;
  }
}

function addGenesisBlock(block) {
  let blockHeight = 0;
  db.createReadStream()
    .on('data', () => blockHeight++)
    .on('error', err => console.error('Unable to read data stream!', err))
    .on('close', () => {
      if (blockHeight === 0) addLevelDBData(blockHeight, block);
    });
}

// Add new block to levelDB (blockchain)
function addDataToLevelDB(block) {
  let blockHeight = 0;
  db.createReadStream()
    .on('data', () => blockHeight++)
    .on('error', err => console.error('Unable to read data stream!', err))
    .on('close', () => addLevelDBData(blockHeight, block));
}

async function validateBlock(blockHeight) {
  const data = await db.get(blockHeight);
  const block = JSON.parse(data);
  const blockHash = block.hash;
  block.hash = '';
  const isValid = blockHash === SHA256(JSON.stringify(block)).toString();
  console.log(`\nBlock (${block.height}) is ${isValid ? 'valid' : 'invalid'}`);
  return isValid;
}

// Validate each block for the entire blockchain
async function validateAllBlocks(blockHeight) {
  const errs = [];
  try {
    for (let height = 0; blockHeight > height; height++) {
      if (!validateBlock(height)) {
        errs.push(height);
      }
    }

    if (errs.length > 0) {
      throw errs;
    }

    console.log('\nBlockchain is valid.');
  } catch (err) {
    console.error('ERROR! Invalid blocks: ', err);
  }
}

// Validate blockchain
function validateChain() {
  let blockHeight = 0;
  db.createReadStream()
    .on('data', () => blockHeight++)
    .on('error', err => console.error('Unable to read data stream!', err))
    .on('close', () => validateAllBlocks(blockHeight));
}

async function getAllBlocksFromDB(blockHeight) {
  const blocks = [];
  for (let i = 0; blockHeight > i; i++) {
    const data = await db.get(i);
    const block = JSON.parse(data);
    blocks.push(block);
  }
  console.log('\nAll blocks\n', blocks);
  return blocks;
}

// Get all blocks
function getAllBlocks() {
  let blockHeight = 0;
  db.createReadStream()
    .on('data', () => blockHeight++)
    .on('error', err => console.error('Unable to read data stream!', err))
    .on('close', () => getAllBlocksFromDB(blockHeight));
}

// (For testing) Modify a block's hash to break the blockchain validation
async function modifyBlock(key) {
  try {
    const result = await db.get(key);
    const data = JSON.parse(result);
    data.hash = 'BOOOO';
    await db
      .put(key, JSON.stringify(data))
      .then(() => db.get(key))
      .then(updated => console.log(`\nModified block(${key}): `, updated));
    return result;
  } catch (err) {
    console.error('Not found', err);
    return err;
  }
}

module.exports = {
  getBlockHeight,
  addDataToLevelDB,
  getLevelDBData,
  validateChain,
  getAllBlocks,
  modifyBlock,
  addGenesisBlock,
  validateBlock
};
