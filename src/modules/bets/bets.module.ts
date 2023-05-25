import { Module } from "@nestjs/common";
import { BetsService } from "./bets.service";
import { BetsController } from "./bets.controller";
import { GamesService } from "../games/games.service";

@Module({
  providers: [BetsService, GamesService],
  controllers: [BetsController],
})
export class BetsModule {}

