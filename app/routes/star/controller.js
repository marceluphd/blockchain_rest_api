const Blockchain = require('../../models/blockchain');

/**
 * @api {get} /stars/hash::hash Request a blcok information
 * @apiName GetByHash
 * @apiGroup Block
 *
 * @apiParam {String}      hash                         Block hash
 *
 * @apiSuccess {Object}    block                        Block information
 * @apiSuccess {String}    block.hash                   Block hash
 * @apiSuccess {String}    block.previousBlockHash      Previous block's hash
 * @apiSuccess {Number}    block.height                 Block height
 * @apiSuccess {Timestamp} block.time                   Block's timestamp
 * @apiSuccess {Object}    block.body                   Block body object
 * @apiSuccess {String}    block.body.address           Wallet address
 * @apiSuccess {Object}    block.body.star              Star object
 * @apiSuccess {String}    block.body.star.dec          Declination
 * @apiSuccess {String}    block.body.star.ra           Right ascension
 * @apiSuccess {String}    block.body.star.story        Hex encoded Ascii string
 * @apiSuccess {String}    block.body.star.storyDecoded Decoded story
 */
async function getByHash(req, res) {
  const { hash } = req.params;

  if (hash === undefined) {
    return res.status(404).send({ error: 'Cannot find a block without hash.' });
  }

  try {
    const block = await Blockchain.getByHash(hash);
    if (!block) return res.status(404).send({ error: `Block (hash: ${hash}) is not found.` });
    return res.status(200).send(block);
  } catch (err) {
    if (/key not found/i.test(err.message)) {
      return res.status(404).send({ error: `Block (hash: ${hash}) is not found.` });
    }

    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /stars/address::address Request a blcok information
 * @apiName GetByAddress
 * @apiGroup Block
 *
 * @apiParam {String}      address                      Wallet address
 *
 * @apiSuccess {Object[]}  block[]                      Array of blocks
 *
 * @apiSuccess {String}    block.hash                   Block hash
 * @apiSuccess {String}    block.previousBlockHash      Previous block's hash
 * @apiSuccess {Number}    block.height                 Block height
 * @apiSuccess {Timestamp} block.time                   Block's timestamp
 * @apiSuccess {Object}    block.body                   Block body object
 * @apiSuccess {String}    block.body.address           Wallet address
 * @apiSuccess {Object}    block.body.star              Star object
 * @apiSuccess {String}    block.body.star.dec          Declination
 * @apiSuccess {String}    block.body.star.ra           Right ascension
 * @apiSuccess {String}    block.body.star.story        Hex encoded Ascii string
 * @apiSuccess {String}    block.body.star.storyDecoded Decoded story
 */
async function getByAddress(req, res) {
  const { address } = req.params;

  if (address === undefined) {
    return res.status(404).send({ error: 'Cannot find a block without address.' });
  }

  try {
    const blocks = await Blockchain.getByAddress(address);
    if (!blocks.length) {
      return res.status(404).send({
        error: `Block (address: ${address}) is not found.`
      });
    }
    return res.status(200).send(blocks);
  } catch (err) {
    if (/key not found/i.test(err.message)) {
      return res.status(404).send({ error: `Block (address: ${address}) is not found.` });
    }

    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

module.exports = {
  getByHash,
  getByAddress
};
