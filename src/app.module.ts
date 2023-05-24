import { Module } from "@nestjs/common";
import {
  GamesModule,
  AuthModule,
  BetsModule,
  PrismaModule,
  UsersModule,
} from "./modules";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./guards";

@Module({
  imports: [GamesModule, PrismaModule, UsersModule, BetsModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}

