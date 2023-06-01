import { Expose, Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";

class Game {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;
}

class Bet {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => value.split(", ").map((item) => Number(item)))
  choosenNumbers: number[];

  @Expose()
  @Type(() => Game)
  game: Game;
}

export class BetsDto {
  @Expose()
  @IsArray()
  @Type(() => Bet)
  bets: Bet[];

  @Expose()
  message: string;
}
