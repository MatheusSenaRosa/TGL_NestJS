export interface IBet {
  gameId: number;
  choosenNumbers: number[];
}

export interface IBetJoinedWithGame extends IBet {
  price: number;
  requiredAmount: number;
}

