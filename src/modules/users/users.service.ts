import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ICreateUser, IFindUnique, IUpdateUser } from "./types";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(attributes: IFindUnique) {
    const user = await this.prisma.user.findUnique({
      where: attributes,
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async findByPasswordToken(passwordToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        passwordToken,
      },
    });

    if (!user) throw new BadRequestException("Invalid token");

    return user;
  }

  async create({ name, email, password, roleId }: ICreateUser) {
    const emailIsAlreadyInUse = await this.prisma.user.findUnique({
      where: { email },
    });

    if (emailIsAlreadyInUse)
      throw new ConflictException("This e-mail is already in use");

    const user = await this.prisma.user.create({
      data: { name, email, password, roleId },
    });

    return user;
  }

  async update(id: number, attributes: IUpdateUser) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) throw new NotFoundException("User not found");

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: attributes,
    });

    return user;
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

