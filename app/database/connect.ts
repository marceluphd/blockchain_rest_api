import * as level from 'level';

const blockchainDB = './blockchainDB';
const db = level(blockchainDB);

const validationDB = './validationDB';
const rdb = level(validationDB);

export default {
  connect: () => db,
  connectValidation: () => rdb
};
