import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  SignupDto,
  AuthDto,
  SigninDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "./dtos";
import { Serialize } from "../../interceptors";
import { CurrentUser, Public } from "../../decorators";
import { RefreshTokenGuard } from "../../guards";

@Controller("auth")
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }

  @Post("signin")
  @Public()
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: SigninDto) {
    return this.authService.signIn(body);
  }

  @Post("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@CurrentUser("id") userId: number) {
    return this.authService.signOut(userId);
  }

  @Public()
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@CurrentUser() user: { refreshToken: string; id: number }) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("forgot-password")
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put("reset-password")
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}

