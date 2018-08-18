import db from '../database/level_db';

const blockchain = () => ({
  getAllBlocks: () => db.getAllBlocks(),
  getBlockHeight: () => db.getBlockHeight(),
  addGenesisBlock: () => db.addGenesisBlock(),
  getBlock: (key: number) => db.getBlock(key),
  addBlock: (body: string) => db.addBlock(body),
  validateBlock: (key: number) => db.validateBlock(key),
  validateBlockchain: () => db.validateBlockchain()
});

export default blockchain();
