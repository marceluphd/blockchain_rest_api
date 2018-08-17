/* eslint-disable no-console */
const app = require('./app');
const config = require('./config/config');

const blockchain = require('./models/blockchain');

blockchain
  .getAllBlocks()
  .then(blocks => {
    if (!blocks || !blocks.length) {
      return blockchain.addGenesisBlock().then(block => [block]);
    }
    return blocks;
  })
  .then(allBlocks => {
    console.log(`Current block height: ${allBlocks.length - 1}`);
    app.listen(config.port, () => {
      console.log('Sever started localhost:%s', config.port);
    });
  })
  .catch(err => console.error(err));
