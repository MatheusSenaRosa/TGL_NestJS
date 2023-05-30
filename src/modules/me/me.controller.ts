import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from "@nestjs/common";
import { CurrentUser } from "../../decorators";
import { MeService } from "./me.service";
import { Serialize } from "../../interceptors";
import { UpdateUserDto, UserDto } from "./dtos";

@Controller("me")
@Serialize(UserDto)
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  whoAmI(@CurrentUser("id") userId: number) {
    return this.meService.whoAmI(userId);
  }

  @Patch()
  update(@CurrentUser("id") userId: number, @Body() body: UpdateUserDto) {
    return this.meService.update(userId, body);
  }
}
