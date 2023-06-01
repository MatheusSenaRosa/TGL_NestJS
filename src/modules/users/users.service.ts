import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ICreateUser, IFindUnique, IUpdateUser } from "./types";
import { RolesService } from "../roles/roles.service";
import { MailerService } from "@nestjs-modules/mailer";
import * as crypto from "crypto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RolesService,
    private readonly emailService: MailerService
  ) {}

  generatePasswordToken() {
    const passwordToken = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date();

    const currentHour = expiresAt.getHours();
    const hoursAmountToExpire = 2;
    expiresAt.setHours(currentHour + hoursAmountToExpire);

    return {
      passwordToken,
      passwordTokenExpiresAt: expiresAt,
    };
  }

  async findUnique(attributes: IFindUnique) {
    const user = await this.prisma.user.findUnique({
      where: attributes,
    });

    if (!user) throw new NotFoundException("User not found");

    const { name: role } = await this.roleService.findUnique({
      id: user.roleId,
    });

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

  async sendAdminEmail(email: string, passwordToken: string) {
    await this.emailService.sendMail({
      to: email,
      from: process.env.COMPANY_EMAIL,
      subject: "Create a password to your account",
      text: `Use this token to create your password: 
${passwordToken}`,
    });
  }

  async create({ name, email, password, role }: ICreateUser) {
    const emailIsAlreadyInUse = await this.prisma.user.findUnique({
      where: { email },
    });

    if (emailIsAlreadyInUse)
      throw new ConflictException("This e-mail is already in use");

    const { id: roleId } = await this.roleService.findUnique({ name: role });

    let user = await this.prisma.user.create({
      data: { name, email, password, roleId },
    });

    if (role === "Administrator") {
      const { passwordToken, passwordTokenExpiresAt } =
        this.generatePasswordToken();

      user = await this.update(user.id, {
        passwordToken,
        passwordTokenExpiresAt,
      });

      await this.sendAdminEmail(user.email, passwordToken);
    }

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

  async remove(userId: number) {
    const userExists = await this.findUnique({
      id: userId,
    });

    if (!userExists) throw new NotFoundException("User not found");

    await this.prisma.user.delete({ where: { id: userId } });
  }
}
