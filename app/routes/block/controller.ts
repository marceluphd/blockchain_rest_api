import { Request, Response } from 'express';
import Blockchain from '../../models/blockchain';

/**
 * @api {get} /block/:id Request a blcok information
 * @apiName GetBlock
 * @apiGroup Block
 *
 * @apiParam {Number}      id                      Block height (key)
 *
 * @apiSuccess {Object}    block                   Block information
 * @apiSuccess {String}    block.hash              Block hash
 * @apiSuccess {String}    block.previousBlockHash Previous block's hash
 * @apiSuccess {Number}    block.height            Block height
 * @apiSuccess {String}    block.body              Block body string
 * @apiSuccess {Timestamp} block.time              Block's timestamp of creation
 */
async function getBlock(req: Request, res: Response) {
  const { id } = req.params;

  if (id === undefined) {
    return res.status(404).send({ error: 'Cannot find a block without id.' });
  }

  try {
    const block = await Blockchain.getBlock(req.params.id);
    return res.status(200).send(block);
  } catch (err) {
    if (/key not found/i.test(err.message)) {
      return res.status(404).send({ error: `Block (${id}) is not found.` });
    }

    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {post} /block/ Add a block to the blockchain
 * @apiName AddBlock
 * @apiGroup Block
 *
 * @apiParam {String}      body                    Block's body string
 *
 * @apiSuccess {Object}    block                   Block information
 *
 * @apiSuccess {String}    block.hash              Block hash
 * @apiSuccess {String}    block.previousBlockHash Previous block's hash
 * @apiSuccess {Number}    block.height            Block height
 * @apiSuccess {String}    block.body              Block body string
 * @apiSuccess {Timestamp} block.time              Block's timestamp of creation
 */
async function addBlock(req: Request, res: Response) {
  const { body } = req.body;

  if (!body) {
    return res.status(500).send('Cannot add a block without body.');
  }

  try {
    const result = await Blockchain.addBlock(body);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /block/validate/:id Validate a block
 * @apiName ValidateBlock
 * @apiGroup Block
 *
 * @apiParam {Number} id Block height (key).
 *
 * @apiSuccess {Object}  block         Result of validation of a block
 * @apiSuccess {Boolean} block.isValid If the block is valid or not
 */
async function validateBlock(req: Request, res: Response) {
  const { id } = req.params;

  if (id === undefined) {
    return res.status(500).send({ error: 'Cannot find a block without id.' });
  }

  try {
    const result = await Blockchain.validateBlock(req.params.id);
    return res.status(200).send({ isValid: result });
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /block/validate_all Validate the blockchain
 * @apiName ValidateBlockchain
 * @apiGroup Block
 *
 * @apiSuccess {Object}  result         Result of validation of the blockchain
 * @apiSuccess {Boolean} result.isValid If the blockchain is valid or not
 */
async function validateBlockchain(_req: Request, res: Response) {
  try {
    const result = await Blockchain.validateBlockchain();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /block/height Request the blockchain's block height
 * @apiName GetBlockHeight
 * @apiGroup Block
 *
 * @apiSuccess {Object} result             Result
 * @apiSuccess {Number} result.blockHeight Block height
 */
async function getBlockHeight(_req: Request, res: Response) {
  try {
    const blockHeight = await Blockchain.getBlockHeight();
    return res.status(200).send({ blockHeight });
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /block/all Request all blocks
 * @apiName GetAllBlocks
 * @apiGroup Block
 *
 * @apiSuccess {Object[]}  blocks                   Array of block
 *
 * @apiSuccess {String}    blocks.hash              Block hash
 * @apiSuccess {String}    blocks.previousBlockHash Previous block's hash
 * @apiSuccess {Number}    blocks.height            Block height
 * @apiSuccess {String}    blocks.body              Block body string
 * @apiSuccess {Timestamp} blocks.time              Block's timestamp of creation
 */
async function getAllBlocks(_req: Request, res: Response) {
  try {
    const allBlocks = await Blockchain.getAllBlocks();
    return res.status(200).send(allBlocks);
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

export default {
  addBlock,
  getBlock,
  validateBlock,
  validateBlockchain,
  getBlockHeight,
  getAllBlocks
};
