import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { GamesService } from "./games.service";
import { CreateGameDto } from "./dtos";
import { CurrentUser, Public } from "../../decorators";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  listGames(@CurrentUser() teste) {
    console.log(teste);
    return this.gamesService.list();
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  createGame(@Body() game: CreateGameDto) {
    return this.gamesService.create(game);
  }

  @Delete(":gameId")
  @HttpCode(HttpStatus.OK)
  deleteGame(@Param("gameId") gameId: string) {
    return this.gamesService.delete(Number(gameId));
  }
}

