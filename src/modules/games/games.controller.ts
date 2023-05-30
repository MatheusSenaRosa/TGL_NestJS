import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Delete,
  Patch,
  Param,
} from "@nestjs/common";
import { GamesService } from "./games.service";
import { Public } from "../../decorators";
import { AdminGuard } from "../../guards";
import { Serialize } from "../../interceptors";
import {
  CreateGamesDto,
  GamesDto,
  RemoveGamesDto,
  UpdateGameDto,
} from "./dtos";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Public()
  @Serialize(GamesDto)
  @HttpCode(HttpStatus.OK)
  list() {
    return this.gamesService.list();
  }

  @Post()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateGamesDto) {
    return this.gamesService.createMany(body);
  }

  @Patch(":gameId")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param("gameId") gameId: string, @Body() body: UpdateGameDto) {
    return this.gamesService.update(Number(gameId), body);
  }

  @Delete()
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body() body: RemoveGamesDto) {
    return this.gamesService.removeMany(body.gameIds);
  }
}
