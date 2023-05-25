import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AccessTokenStrategy } from "../auth/strategies";

@Module({
  providers: [UsersService, AccessTokenStrategy],
  controllers: [],
})
export class UsersModule {}

