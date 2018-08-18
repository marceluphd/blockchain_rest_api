import * as level from 'level';

const blockchainDB = './blockchainDB';
const db = level(blockchainDB);

export default db;
