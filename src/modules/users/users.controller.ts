import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  listUsers() {
    return this.usersService.list();
  }
}

