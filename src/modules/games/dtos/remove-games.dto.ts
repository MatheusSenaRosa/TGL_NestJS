import { ArrayNotEmpty, IsArray, IsNumber } from "class-validator";

export class RemoveGamesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  gameIds: number[];
}
