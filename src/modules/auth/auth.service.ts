import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignupDto, SigninDto } from "./dtos";
import * as bcrypt from "bcrypt";
import { ITokenPayload, IUser } from "./types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async hashData(data: string) {
    const hash = await bcrypt.hash(data, 10);

    return hash;
  }

  async generateToken(payload: ITokenPayload, isRefreshToken?: boolean) {
    const oneWeek = 60 * 60 * 24 * 7;
    const fifteenMinutes = 60 * 15;

    return this.jwtService.signAsync(payload, {
      secret: isRefreshToken ? "rt-secret" : "at-secret",
      expiresIn: isRefreshToken ? oneWeek : fifteenMinutes,
    });
  }

  async getTokens(user: IUser) {
    const payload = { sub: user.id, email: user.email, name: user.name };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload),
      this.generateToken(payload, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async signup({ name, email, password }: SignupDto) {
    const isEmailAlreadyInUse = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailAlreadyInUse)
      throw new ConflictException("This e-mail is already in use");

    const hashedPassword = await this.hashData(password);
    const newUser = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { accessToken, refreshToken } = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, refreshToken);

    return {
      ...newUser,
      accessToken,
      refreshToken,
    };
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new BadRequestException("E-mail or password is invalid");

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches)
      throw new BadRequestException("E-mail or password is invalid");

    const { accessToken, refreshToken } = await this.getTokens(user);
    await this.updateRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}

