export interface IBet {
  gameId: number;
  choosenNumbers: number[] | string;
}

export interface IBetJoinedWithGame extends IBet {
  price: number;
  requiredAmount: number;
}
