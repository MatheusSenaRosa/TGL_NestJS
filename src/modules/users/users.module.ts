import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AccessTokenStrategy } from "../auth/strategies";
import { UsersController } from "./users.controller";
import { RolesService } from "../roles/roles.service";

@Module({
  providers: [UsersService, RolesService, AccessTokenStrategy],
  controllers: [UsersController],
})
export class UsersModule {}
