import { IBlock } from '../utils/block_schema';

class Block {
  public hash: IBlock['hash'];
  public height: IBlock['height'];
  public body: IBlock['body'];
  public time: IBlock['time'];
  public previousBlockHash: IBlock['previousBlockHash'];

  constructor(data: IBlock['body']) {
    this.hash = '';
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = '';
  }
}

export default Block;
