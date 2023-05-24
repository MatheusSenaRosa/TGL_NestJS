import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies";
import { UsersService } from "../users/users.service";
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AccessTokenStrategy],
})
export class AuthModule {}

