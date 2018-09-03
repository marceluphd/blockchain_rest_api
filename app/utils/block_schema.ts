export interface IBlock {
  hash: string;
  height: number;
  body: {
    address: string,
    star: {
      ra: string,
      dec: string,
      story: string,
      storyDecoded: string
    }
  };
  time: number;
  previousBlockHash: string;
}
