import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDto } from "./dtos";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(data: SignUpDto) {
    const foundByEmail = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (foundByEmail)
      throw new ConflictException("This e-mail is already in use");

    const newUser = await this.prisma.user.create({
      data,
    });

    return newUser;
  }
}

