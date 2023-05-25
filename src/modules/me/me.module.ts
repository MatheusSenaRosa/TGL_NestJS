import { Module } from "@nestjs/common";
import { MeService } from "./me.service";
import { MeController } from "./me.controller";
import { AccessTokenStrategy } from "../auth/strategies";
import { UsersService } from "../users/users.service";

@Module({
  providers: [MeService, UsersService, AccessTokenStrategy],
  controllers: [MeController],
})
export class MeModule {}

