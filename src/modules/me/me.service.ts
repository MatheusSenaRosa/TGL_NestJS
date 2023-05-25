import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UpdateUserDto } from "./dtos";

@Injectable()
export class MeService {
  constructor(private readonly usersService: UsersService) {}

  async whoAmI(userId: number) {
    const user = await this.usersService.findUnique({ id: userId });
    return user;
  }

  async update(userId: number, attributes: UpdateUserDto) {
    const user = await this.usersService.update(userId, attributes);

    return user;
  }
}

