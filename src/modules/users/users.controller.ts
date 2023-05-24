import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser } from "../../decorators";
import { Serialize } from "../../interceptors";
import { UserDto } from "./dtos";

@Serialize(UserDto)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("whoami")
  @HttpCode(HttpStatus.OK)
  whoAmI(@CurrentUser("id") userId: number) {
    return this.usersService.findUnique({ id: userId });
  }
}

