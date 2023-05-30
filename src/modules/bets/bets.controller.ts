import { Body, Controller, Post } from "@nestjs/common";
import { BetsService } from "./bets.service";
import { BetsDto, CreateBetsDto } from "./dtos";
import { CurrentUser } from "../../decorators";
import { Serialize } from "../../interceptors";

@Controller("bets")
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @Serialize(BetsDto)
  create(@CurrentUser("id") userId: number, @Body() body: CreateBetsDto) {
    return this.betsService.create(userId, body);
  }
}
