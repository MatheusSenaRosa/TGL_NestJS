import { IsNumber, IsString } from "class-validator";

export class CreateGameDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  range: number;

  @IsNumber()
  price: number;

  @IsNumber()
  requiredAmount: number;

  @IsString()
  color: string;
}

