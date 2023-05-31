import { Body, Controller, Post, Put, UseGuards } from "@nestjs/common";
import { CreateUserDto, UserDto } from "./dtos";
import { AdminGuard } from "../../guards";
import { UsersService } from "./users.service";
import * as crypto from "crypto";
import { Serialize } from "../../interceptors";

@Controller("users")
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: CreateUserDto) {
    return this.usersService.create({
      email: body.email,
      name: body.name,
      password: crypto.randomBytes(20).toString("hex"),
      role: "Administrator",
    });
  }
}
