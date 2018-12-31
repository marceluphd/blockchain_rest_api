import { IBlock } from '../utils/block_schema';
import { IError } from '../utils/error_schema';
import { IValidatedRequest, IValidationRequest } from '../utils/validation_schema';
import validationDB from './connect';

const db = validationDB.connectValidation();

function saveRequest(validationRequest: IValidationRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    db.put(validationRequest.address, JSON.stringify(validationRequest))
      .then(() => resolve({ ok: true }))
      .catch((err: IError) => reject(err));
  });
}

function saveUpdatedRequest(validationRequest: IValidatedRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    db.put(validationRequest.status.address, JSON.stringify(validationRequest))
      .then(() => resolve({ ok: true }))
      .catch((err: IError) => reject(err));
  });
}

function getRequest(address: IBlock['body']['address']): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(address)
      .then((data: string) => resolve(JSON.parse(data)))
      .catch((err: IError) => reject(err));
  });
}

function deleteRequest(address: IBlock['body']['address']): Promise<any> {
  return new Promise((resolve, reject) => {
    db.del(address)
      .then(() => resolve({ ok: true }))
      .catch((err: IError) => reject(err));
  });
}

export default {
  saveRequest,
  getRequest,
  deleteRequest,
  saveUpdatedRequest
};
