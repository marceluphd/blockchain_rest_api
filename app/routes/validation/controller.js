require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const Validation = require('../../models/validation');
const { generateTimestamp } = require('../../helpers/helpers');

/**
 * @api {post} /requestValidation
 * @apiDescription Initiate validation of given wallet address. Then, users need
 *                 to prove their identity by their signature later within 5 mins.
 * @apiName RequestValidation
 * @apiGroup Validation
 *
 * @apiParam   {String} address              Wallet Address
 *
 * @apiSuccess {Object} res                  Response Object
 * @apiSuccess {String} res.address          Wallet Address
 * @apiSuccess {Number} res.requestTimeStamp Timestamp
 * @apiSuccess {String} res.message          Verification message
 * @apiSuccess {Number} res.validationWindow Remaining time to register
 */
async function validateRequest(req, res) {
  const { address } = req.body;
  if (!address) {
    return res.status(500).send('Wallet address is required.');
  }

  try {
    const request = await Validation.getRequest(address);
    if (request.registerStar && request.status && request.status.messageSignature) {
      return res.status(200).send({
        note: 'Your address is already verified. You are allowed to register a star.'
      });
    }
  } catch (err) {
    // 'key not dound' is not error for this case since no validation record
    // is found, which is the starting state to initiate validation.
    if (!/key not found/i.test(err.message)) {
      return res.status(500).send({ error: err ? err.message : 'Could not process.' });
    }
  }

  const requestTimeStamp = generateTimestamp();

  // store this validation request to verify later when validating with signature
  const validationRequest = {
    address,
    requestTimeStamp,
    message: `${address}:${requestTimeStamp}:starRegistry`,
    validationWindow: 300 // 300 seconds = 5 mins
  };

  try {
    await Validation.saveRequest(validationRequest);
    return res.status(200).send(validationRequest);
  } catch (e) {
    return res.status(500).send({ error: e ? e.message : 'Could not process.' });
  }
}


/**
 * @api {post} /message-signature/validate
 * @apiDescription Users will prove their blockchain identity by signing
 *                 a message with their wallet.
 *                 Once they sign this message, the application will validate
 *                 their request and grant access to register a star.
 * @apiName ValidateMsgSig
 * @apiGroup Validation
 *
 * @apiParam   {String}  address                     Wallet Address
 * @apiParam   {String}  signature                   Signature
 *
 * @apiSuccess {Object}  res                         Response Object
 * @apiSuccess {Boolean} res.registerStar            Successfully registered or not
 * @apiSuccess {String}  res.status.address          Wallet Address
 * @apiSuccess {Number}  res.status.requestTimeStamp Timestamp
 * @apiSuccess {String}  res.status.message          Verification message
 * @apiSuccess {Number}  res.status.validationWindow Remaining time to register
 * @apiSuccess {Boolean} res.status.messageSignature Is signature valid or not
 */
async function validateMsgSig(req, res) {
  const { address, signature } = req.body;
  if (!address || !signature) {
    return res.status(500).send('Both wallet address and signature are required.');
  }

  // Get this address's request and if 5 mins passed since the request -> error
  let request;
  let timePassed;
  const now = generateTimestamp();
  try {
    request = await Validation.getRequest(address);
    if (!request) {
      return res.status(404).send({ error: 'Request is not found.' });
    }

    // If 5 mins passes since validation request, it expires
    timePassed = now - request.requestTimeStamp;
    if (timePassed > 300) {
      await Validation.deleteRequest(address);
      return res.status(400).send({
        error: 'Request is expired already. Please request to validate again /requestValidation'
      });
    }

    // Already verified
    if (request.registerStar && request.status && request.status.messageSignature) {
      return res.status(200).send(request);
    }
  } catch (e) {
    return res.status(500).send({ error: e ? e.message : 'Could not process.' });
  }

  // Verify signature bitcoinMessage.verify(message, address, signature)
  let verified;
  try {
    verified = bitcoinMessage.verify(request.message, request.address, signature);
  } catch (err) {
    return res.status(500).send({ error: 'Could not process.' });
  }

  const updatedValidationInfo = {
    registerStar: verified,
    status: {
      ...request,
      validationWindow: 300 - timePassed,
      messageSignature: verified
    }
  };

  // Update the response object
  await Validation.saveUpdatedRequest(updatedValidationInfo);

  return res.status(200).send(updatedValidationInfo);
}

module.exports = {
  validateRequest,
  validateMsgSig
};
