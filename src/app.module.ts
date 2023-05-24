import { Module } from "@nestjs/common";
import {
  GamesModule,
  AuthModule,
  BetsModule,
  PrismaModule,
  UsersModule,
} from "./modules";

@Module({
  imports: [GamesModule, PrismaModule, UsersModule, BetsModule, AuthModule],
})
export class AppModule {}

