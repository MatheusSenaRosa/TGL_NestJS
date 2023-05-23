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

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listGames() {
    return this.gamesService.list();
  }

  @Post()
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

