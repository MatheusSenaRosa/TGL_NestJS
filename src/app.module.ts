import { Module } from "@nestjs/common";
import { GamesModule } from "./games/games.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./users/users.module";
import { BetsModule } from "./bets/bets.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [GamesModule, PrismaModule, UserModule, BetsModule, AuthModule],
})
export class AppModule {}

