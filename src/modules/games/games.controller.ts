import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { GamesService } from "./games.service";
import { Public } from "../../decorators";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @Public()
  @HttpCode(HttpStatus.OK)
  list() {
    return this.gamesService.list();
  }
}

