import db from '../database/level_db';
import { IBlock } from '../utils/block_schema';

const blockchain = () => ({
  getAllBlocks: () => db.getAllBlocks(),
  getBlockHeight: () => db.getBlockHeight(),
  addGenesisBlock: () => db.addGenesisBlock(),
  getByHeight: (height: IBlock['height']) => db.getByHeight(height),
  addBlock: (body: IBlock['body']) => db.addBlock(body),
  validateBlock: (height: IBlock['height']) => db.validateBlock(height),
  validateBlockchain: () => db.validateBlockchain(),
  getByAddress: (address: IBlock['body']['address']) => db.getByAddress(address),
  getByHash: (hash: IBlock['hash']) => db.getByHash(hash)
});

export default blockchain();
