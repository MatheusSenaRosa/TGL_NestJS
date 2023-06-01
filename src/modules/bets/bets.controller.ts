import { Body, Controller, Post, Get } from "@nestjs/common";
import { BetsService } from "./bets.service";
import { BetsDto, CreateBetsDto } from "./dtos";
import { CurrentUser } from "../../decorators";
import { Serialize } from "../../interceptors";

@Controller("bets")
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  createMany(@CurrentUser("id") userId: number, @Body() body: CreateBetsDto) {
    return this.betsService.createMany(userId, body);
  }

  @Get()
  @Serialize(BetsDto)
  list(@CurrentUser("id") userId: number) {
    return this.betsService.list(userId);
  }
}
