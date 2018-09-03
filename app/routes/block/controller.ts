import { Request, Response } from 'express';

import Blockchain from '../../models/blockchain';
import Validation from '../../models/validation';
import { IBlock } from '../../utils/block_schema';
import { IValidatedRequest } from '../../utils/validation_schema';

/**
 * @api {post} /block Add a star registry into blockchain
 * @apiName AddStar
 * @apiGroup Block
 *
 * @apiParam   {String}    address                      Wallet address
 * @apiParam   {Object}    star                         Star registry object
 * @apiParam   {String}    star.ra                      Right ascension
 * @apiParam   {String}    star.dec                     Declination
 * @apiParam   {String}    star.story                   Story
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
async function addStar(req: Request, res: Response): Promise<IBlock | any> {
  const { address, star } = req.body;

  if (!address || !star) {
    return res.status(404).send({ error: 'Address and star information are required' });
  }

  // Check if this address is allowed to register
  try {
    const request: IValidatedRequest = await Validation.getRequest(address);
    if (!request.registerStar || !request.status || !request.status.messageSignature) {
      return res.status(403).send({
        note: 'Your are not allowed to register a star. Please validate address first.'
      });
    }
  } catch (err) {
    if (/key not found/i.test(err.message)) {
      return res.status(403).send({
        note: 'Your are not allowed to register a star. Please validate address first.'
      });
    }
    return res.status(500).send({ error: 'Something went wrong' });
  }

  try {
    const newBlock = await Blockchain.addBlock({ address, star });
    // Once a star is registered, clear validation request to reset the
    // validation to be secure (Users have to validate each time to add a star).
    await Validation.deleteRequest(address);
    return res.status(200).send(newBlock);
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

/**
 * @api {get} /block/:id Request a blcok information
 * @apiName GetByHeight
 * @apiGroup Block
 *
 * @apiParam {Number}      id                      Block height (key)
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
async function getByHeight(req: Request, res: Response): Promise<IBlock | any> {
  const { height } = req.params;

  if (height === undefined) {
    return res.status(404).send({ error: 'Cannot find a block without height.' });
  }

  try {
    const block = await Blockchain.getByHeight(height);
    return res.status(200).send(block);
  } catch (err) {
    if (/key not found/i.test(err.message)) {
      return res.status(404).send({ error: `Block (height: ${height}) is not found.` });
    }

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
async function validateBlock(req: Request, res: Response): Promise<any> {
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
async function validateBlockchain(_: Request, res: Response): Promise<any> {
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
async function getBlockHeight(_: Request, res: Response): Promise<any> {
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
 * @apiSuccess {Object[]}  blocks                       Array of block
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
async function getAllBlocks(_: Request, res: Response): Promise<IBlock[] | any> {
  try {
    const allBlocks = await Blockchain.getAllBlocks();
    return res.status(200).send(allBlocks);
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }
}

export default {
  addStar,
  getByHeight,
  validateBlock,
  validateBlockchain,
  getBlockHeight,
  getAllBlocks
};
