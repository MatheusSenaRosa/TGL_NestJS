import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AccessTokenStrategy } from "../auth/strategies";

@Module({
  providers: [UsersService, AccessTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule {}

