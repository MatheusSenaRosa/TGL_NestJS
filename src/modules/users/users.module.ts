import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AccessTokenStrategy } from "../auth/strategies";
import { UsersController } from "./users.controller";

@Module({
  providers: [UsersService, AccessTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule {}

