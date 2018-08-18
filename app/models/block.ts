class Block {
  public hash: string;
  public height: number;
  public body: string;
  public time: string;
  public previousBlockHash: string;

  constructor(data: string) {
    this.hash = '';
    this.height = 0;
    this.body = data;
    this.time = '0';
    this.previousBlockHash = '';
  }
}

export default Block;
