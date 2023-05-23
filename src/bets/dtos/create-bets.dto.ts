import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from "class-validator";

class Bet {
  @IsNumber()
  gameId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  choosenNumbers: number[];
}

export class CreateBetsDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Bet)
  bets: Bet[];
}

