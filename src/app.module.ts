import { Module } from "@nestjs/common";
import {
  GamesModule,
  AuthModule,
  BetsModule,
  PrismaModule,
  UsersModule,
  MeModule,
} from "./modules";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./guards";

@Module({
  imports: [
    GamesModule,
    PrismaModule,
    UsersModule,
    BetsModule,
    AuthModule,
    MeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}

