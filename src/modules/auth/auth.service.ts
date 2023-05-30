import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { SignupDto, SigninDto, ResetPasswordDto } from "./dtos";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { ICurrentUserRefreshToken, IUser } from "./types";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async hashData(data: string) {
    const hash = await bcrypt.hash(data, 10);

    return hash;
  }

  async generateToken(user: IUser, isRefreshToken?: boolean) {
    const oneWeek = 60 * 60 * 24 * 7;
    const fifteenMinutes = 60 * 15;

    return this.jwtService.signAsync(user, {
      secret: isRefreshToken
        ? process.env.JWT_REFRESH_SECRET
        : process.env.JWT_SECRET,
      expiresIn: isRefreshToken ? oneWeek : fifteenMinutes,
    });
  }

  async getTokens(user: IUser) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(payload),
      this.generateToken(payload, true),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.usersService.update(userId, {
      hashedRefreshToken,
    });
  }

  async signUp({ name, email, password }: SignupDto) {
    const hashedPassword = await this.hashData(password);

    const user = await this.usersService.create({
      name,
      email,
      role: "Customer",
      password: hashedPassword,
    });

    const tokens = await this.getTokens({ ...user, role: "Customer" });
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return {
      ...user,
      role: "Customer",
      ...tokens,
    };
  }

  async signIn({ email, password }: SigninDto) {
    const user = await this.usersService.findUnique({
      email,
    });

    if (!user) throw new BadRequestException("E-mail or password is invalid");

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches)
      throw new BadRequestException("E-mail or password is invalid");

    const { accessToken, refreshToken } = await this.getTokens({
      ...user,
    });
    await this.updateUserRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens({
    id: userId,
    refreshToken,
    role,
  }: ICurrentUserRefreshToken) {
    const user = await this.usersService.findUnique({ id: userId });

    if (!user.hashedRefreshToken) throw new ForbiddenException();

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );

    if (!refreshTokenMatches) throw new ForbiddenException();

    const tokens = await this.getTokens({ ...user, role });
    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findUnique({ email });

    const passwordToken = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date();

    const currentHour = expiresAt.getHours();
    const hoursAmountToExpire = 2;
    expiresAt.setHours(currentHour + hoursAmountToExpire);

    await this.usersService.update(user.id, {
      passwordToken,
      passwordTokenExpiresAt: expiresAt,
    });
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    const { id: userId, passwordTokenExpiresAt } =
      await this.usersService.findByPasswordToken(token);

    const isExpired = new Date() > passwordTokenExpiresAt;

    if (isExpired) throw new BadRequestException("This token has expired");

    const hashedPassword = await this.hashData(newPassword);

    await this.usersService.update(userId, {
      password: hashedPassword,
      passwordToken: null,
      passwordTokenExpiresAt: null,
    });
  }
}
