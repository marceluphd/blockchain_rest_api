/* eslint-disable no-console */
import app from './app';
import config from './config/config';
import blockchain from './models/blockchain';
import { IBlock } from './utils/block_schema';
import { IError } from './utils/error_schema';

blockchain
  .getAllBlocks()
  .then((blocks: IBlock[]) => {
    if (!blocks || !blocks.length) {
      return blockchain.addGenesisBlock().then((block: IBlock) => [block]);
    }
    return blocks;
  })
  .then((allBlocks: IBlock[]) => {
    console.log(`Current block height: ${allBlocks.length - 1}`);
    app.listen(config.port, () => {
      console.log('Sever started localhost:%s', config.port);
    });
  })
  .catch((err: IError) => console.error(err));
