import { Request, Response } from 'express';

import * as bitcoinMessage from 'bitcoinjs-message';

import Validation from '../../models/validation';

import { generateTimestamp } from '../../helpers/helpers';
import { IValidatedRequest, IValidationRequest } from '../../utils/validation_schema';

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
async function validateRequest(req: Request, res: Response): Promise<any> {
  const { address } = req.body;
  if (!address) {
    return res.status(500).send('Wallet address is required.');
  }

  // If the request is already there, reduce the remaining time
  let requestFound: any;
  try {
    requestFound = await Validation.getRequest(address);
    if (requestFound) {
      // If already verified, no need to verify it again and ready to register
      // stars already.
      if (requestFound.registerStar &&
        requestFound.status &&
        requestFound.status.messageSignature) {
        return res.status(200).send({
          info: 'Your address is already verified.'
        });
      }

      // If the request is already expired, remove it and warn the user
      const now = generateTimestamp();
      const remainingTime = 300 - (now - requestFound.requestTimeStamp);
      if (remainingTime <= 0) {
        await Validation.deleteRequest(address);
        return res.status(400).send({
          error: 'Request is expired. Please request again to start the validation.'
        });
      }

      // If not expired yet, show the remaining time til it expires
      return res.status(200).send({
        ...requestFound,
        validationWindow: remainingTime
      });
    }
  } catch (err) {
    // 'key not dound' is not error for this case since no validation record
    // is found, which is the starting state to initiate validation.
    if (!/key not found/i.test(err.message)) {
      return res.status(400).send({ error: err ? err.message : 'Could not process.' });
    }
  }

  const requestTimeStamp = generateTimestamp();

  // store this validation request to verify later when validating with signature
  const validationRequest: IValidationRequest = {
    address,
    requestTimeStamp,
    message: `${address}:${requestTimeStamp}:starRegistry`,
    validationWindow: 300 // 300 seconds = 5 mins
  };

  try {
    await Validation.saveRequest(validationRequest);
    return res.status(200).send(validationRequest);
  } catch (e) {
    console.log(e);
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
async function validateMsgSig(req: Request, res: Response): Promise<any> {
  const { address, signature } = req.body;
  if (!address || !signature) {
    return res.status(500).send('Both wallet address and signature are required.');
  }

  // Get this address's request and if 5 mins passed since the request -> error
  let request: any;
  let timePassed: number;
  const now = generateTimestamp();
  try {
    request = await Validation.getRequest(address);
    if (!request) {
      return res.status(404).send({ error: 'Validation request is not found.' });
    }

    // If 5 mins passes since validation request, it expires
    timePassed = now - request.requestTimeStamp;
    if (timePassed > 300) {
      await Validation.deleteRequest(address);
      return res.status(400).send({
        error: 'Request is expired. Please request to validate again.'
      });
    }

    // Already verified
    if (request.registerStar && request.status && request.status.messageSignature) {
      return res.status(200).send(request);
    }
  } catch (e) {
    if (/key not found/i.test(e.message)) {
      return res.status(400).send({ error: 'Validation request is not found.' });
    }
    console.log(e);
    return res.status(500).send({ error: e ? e.message : 'Could not process.' });
  }

  // Verify signature bitcoinMessage.verify(message, address, signature)
  let verified;
  try {
    verified = bitcoinMessage.verify(request.message, request.address, signature);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: 'Could not process.' });
  }

  const updatedValidationInfo: IValidatedRequest = {
    registerStar: verified,
    status: {
      ...request,
      validationWindow: 300 - timePassed,
      messageSignature: verified
    }
  };

  if (!verified) {
    return res.status(200).send(updatedValidationInfo);
  }

  // Save the validated request
  await Validation.saveUpdatedRequest(updatedValidationInfo);

  return res.status(200).send(updatedValidationInfo);
}

export default {
  validateRequest,
  validateMsgSig
};
