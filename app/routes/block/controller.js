const Blockchain = require('../../models/blockchain');

async function getBlock(req, res) {
  const { id } = req.params;

  if (id === undefined) {
    return res.status(500).send({ error: 'Cannot find a block without id.' });
  }

  try {
    const block = await Blockchain.getBlock(req.params.id);
    return res.status(200).send(block);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function addBlock(req, res) {
  const { body } = req.body;

  if (!body) {
    return res.status(500).send('Cannot add a block without body.');
  }

  try {
    const result = await Blockchain.addBlock(body);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function validateBlock(req, res) {
  const { id } = req.params;

  if (id === undefined) {
    return res.status(500).send({ error: 'Cannot find a block without id.' });
  }

  try {
    const result = await Blockchain.validateBlock(req.params.id);
    return res.status(200).send({ isValid: result });
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function validateBlockchain(req, res) {
  try {
    const result = await Blockchain.validateBlockchain();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function getBlockHeight(req, res) {
  try {
    const blockHeight = await Blockchain.getBlockHeight();
    return res.status(200).send({ blockHeight });
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = {
  addBlock,
  getBlock,
  validateBlock,
  validateBlockchain,
  getBlockHeight
};
