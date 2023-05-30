import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

class Games {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  range: number;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  requiredAmount: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateGamesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Games)
  games: Games[];
}
