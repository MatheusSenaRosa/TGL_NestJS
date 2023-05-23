export type Bet = {
  gameId: number;
  choosenNumbers: number[];
};

export type BetJoinedWithGame = Bet & {
  price: number;
  requiredAmount: number;
};

