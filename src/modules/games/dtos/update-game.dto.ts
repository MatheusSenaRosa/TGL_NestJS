import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateGameDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  range: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  price: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  requiredAmount: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  color: string;
}
