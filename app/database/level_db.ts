import SHA256 = require('crypto-js/sha256');

import Block from '../models/block';
import blockchainDB from './connect';

import { generateTimestamp } from '../helpers/helpers';
import { IBlock } from '../utils/block_schema';
import { IError } from '../utils/error_schema';
import { ILevel } from '../utils/level_schema';

const db = blockchainDB.connect();

/**
 * GETTER
 */

async function getAllBlocksFromDB(blockHeight: IBlock['height']): Promise<IBlock[]> {
  const blocks: IBlock[] = [];
  for (let i = 0; blockHeight > i; i++) {
    const data: string = await db.get(i);
    const block = JSON.parse(data);
    blocks.push(block);
  }
  return blocks;
}

function getByAddress(address: IBlock['body']['address']): Promise<IBlock[]> {
  const foundBlocks: IBlock[] = [];
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', (data: ILevel) => {
        if (data && data.value) {
          const block: IBlock = JSON.parse(data.value);
          if (block && block.body && block.body.address === address) {
            foundBlocks.push(block);
          }
        }
      })
      .on('error', (err: IError) => reject(err))
      .on('close', () => resolve(foundBlocks));
  });
}

function getByHash(hash: IBlock['hash']): Promise<IBlock> {
  let foundBlock: IBlock;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', (data: ILevel) => {
        if (data && data.value) {
          const block: IBlock = JSON.parse(data.value);
          if (block && block.hash === hash) {
            foundBlock = block;
            resolve(foundBlock);
          }
        }
      })
      .on('error', (err: IError) => reject(err))
      .on('close', () => resolve(foundBlock));
  });
}

async function getByHeight(key: IBlock['height']): Promise<IBlock> {
  try {
    const block: string = await db.get(key);
    return JSON.parse(block);
  } catch (err) {
    throw err;
  }
}

function getAllBlocks(): Promise<IBlock[]> {
  let blockHeight: number = 0;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', (err: IError) => reject(err))
      .on('close', () => resolve(getAllBlocksFromDB(blockHeight)));
  });
}

function getBlockHeight(): Promise<number> {
  let blockHeight: number = -1;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', (err: IError) => reject(err))
      .on('close', () => resolve(blockHeight));
  });
}

/**
 * VALIDATE BLOCK(S)
 */

async function validateBlock(blockHeight: IBlock['height']): Promise<boolean> {
  try {
    const block: IBlock = await getByHeight(blockHeight);
    const blockHash = block.hash;
    block.hash = '';
    const isValid = blockHash === SHA256(JSON.stringify(block)).toString();
    return isValid;
  } catch (err) {
    throw err;
  }
}

async function validateAllBlocks(blockHeight: IBlock['height']): Promise<any> {
  const errors: number[] = [];
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

function validateBlockchain(): Promise<any> {
  let blockHeight = 0;
  return new Promise((resolve, reject) => {
    db.createReadStream()
      .on('data', () => blockHeight++)
      .on('error', (err: IError) => reject(err))
      .on('close', () => resolve(validateAllBlocks(blockHeight)));
  });
}

/**
 * INSERT BLOCK
 */

async function addBlockToDB(blockHeight: IBlock['height'], blockData: IBlock): Promise<any> {
  const block = blockData;
  block.height = blockHeight;
  block.time = generateTimestamp();

  if (blockHeight > 0) {
    const prevHash = JSON.parse(await db.get(blockHeight - 1)).hash;
    block.previousBlockHash = prevHash;
  }

  // Encode and decode story
  if (block.body && block.body.star && block.body.star.story) {
    const encodedStroy: string = Buffer.from(block.body.star.story, 'utf8').toString('hex');
    block.body.star.story = encodedStroy;
    block.body.star.storyDecoded = Buffer.from(encodedStroy, 'hex').toString('utf8');
  }

  block.hash = SHA256(JSON.stringify(block)).toString();

  return new Promise((resolve, reject) => {
    db.put(blockHeight, JSON.stringify(block))
      .then(() => db.get(blockHeight))
      .then((data: string) => resolve(JSON.parse(data)))
      .catch((err: IError) => reject(err));
  });
}

function addGenesisBlock(): Promise<IBlock> {
  return addBlockToDB(0, new Block({
    address: 'First block in the chain - Genesis block',
    star: {
      ra: '',
      dec: '',
      story: '',
      storyDecoded: ''
    }
  }));
}

async function addBlock(body: IBlock['body']): Promise<IBlock> {
  try {
    const currentBlockHeight: IBlock['height'] = await getBlockHeight();
    const block: IBlock = new Block(body);
    return addBlockToDB(currentBlockHeight + 1, block);
  } catch (err) {
    throw err;
  }
}

export default {
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
