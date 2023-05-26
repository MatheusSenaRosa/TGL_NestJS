import { Module } from "@nestjs/common";
import { MeService } from "./me.service";
import { MeController } from "./me.controller";
import { AccessTokenStrategy } from "../auth/strategies";
import { UsersService } from "../users/users.service";
import { RolesService } from "../roles/roles.service";

@Module({
  providers: [MeService, UsersService, RolesService, AccessTokenStrategy],
  controllers: [MeController],
})
export class MeModule {}

