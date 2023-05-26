import { Module } from "@nestjs/common";
import {
  GamesModule,
  AuthModule,
  BetsModule,
  PrismaModule,
  UsersModule,
  MeModule,
  RolesModule,
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
    RolesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}

