import { Expose, Transform, Type } from "class-transformer";
import { IsArray } from "class-validator";

class Bet {
  @Expose()
  id: number;

  @Expose()
  gameId: number;

  @Expose()
  @Transform(({ value }) => value.split(", ").map((item) => Number(item)))
  choosenNumbers: number[];
}

export class BetsDto {
  @Expose()
  @IsArray()
  @Type(() => Bet)
  bets: Bet[];
}
