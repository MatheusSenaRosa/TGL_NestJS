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
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Bet)
  bets: Bet[];
}
