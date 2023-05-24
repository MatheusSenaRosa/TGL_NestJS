import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ICreateUser, IFindUnique, IUpdateUser } from "./types";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(attributes: IFindUnique) {
    const user = await this.prisma.user.findUnique({
      where: attributes,
    });

    return user;
  }

  async create({ name, email, password }: ICreateUser) {
    const user = await this.prisma.user.create({
      data: { name, email, password },
    });

    return user;
  }

  async update(id: number, attributes: IUpdateUser) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: attributes,
    });
  }

  async removeRefreshToken(id: number) {
    await this.prisma.user.updateMany({
      where: {
        id,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }
}

