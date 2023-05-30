import { Expose, Transform, Type } from "class-transformer";

class Games {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  range: number;

  @Expose()
  price: number;

  @Expose()
  requiredAmount: number;

  @Expose()
  color: string;
}

export class GamesDto {
  @Expose()
  @Type(() => Games)
  games: Games[];
}
