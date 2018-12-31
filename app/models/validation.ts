import db from '../database/validation_db';
import { IBlock } from '../utils/block_schema';
import { IValidatedRequest, IValidationRequest } from '../utils/validation_schema';

const validation = () => ({
  saveRequest: (r: IValidationRequest) => db.saveRequest(r),
  saveUpdatedRequest: (r: IValidatedRequest) => db.saveUpdatedRequest(r),
  getRequest: (address: IBlock['body']['address']) => db.getRequest(address),
  deleteRequest: (address: IBlock['body']['address']) => db.deleteRequest(address)
});

export default validation();
