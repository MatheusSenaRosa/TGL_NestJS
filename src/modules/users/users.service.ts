import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ICreateUser, IFindUnique, IUpdateUser } from "./types";
import { RolesService } from "../roles/roles.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RolesService
  ) {}

  async findUnique(attributes: IFindUnique) {
    const user = await this.prisma.user.findUnique({
      where: attributes,
    });

    const { name: role } = await this.roleService.findUnique({
      id: user.roleId,
    });

    if (!user) throw new NotFoundException("User not found");

    return {
      ...user,
      role,
    };
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

  async create({ name, email, password, role }: ICreateUser) {
    const emailIsAlreadyInUse = await this.prisma.user.findUnique({
      where: { email },
    });

    if (emailIsAlreadyInUse)
      throw new ConflictException("This e-mail is already in use");

    const { id: roleId } = await this.roleService.findUnique({ name: role });

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
}
