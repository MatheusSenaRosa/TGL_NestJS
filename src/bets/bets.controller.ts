import { Body, Controller, Post } from "@nestjs/common";
import { BetsService } from "./bets.service";
import { CreateBetsDto } from "./dtos";

@Controller("bets")
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  createBets(@Body() body: CreateBetsDto) {
    return this.betsService.create(body);
  }
}

