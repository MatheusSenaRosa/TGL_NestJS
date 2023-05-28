import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dtos";
import { AdminGuard } from "../../guards";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateUserDto) {
    // return this.usersService.create(body)
  }
}

