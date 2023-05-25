import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto, AuthDto, SigninDto } from "./dtos";
import { Serialize } from "../../interceptors";
import { CurrentUser, Public } from "../../decorators";

@Controller("auth")
@Serialize(AuthDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post("signin")
  @Public()
  @HttpCode(HttpStatus.OK)
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  signout(@CurrentUser("id") userId: number) {
    return this.authService.signOut(userId);
  }
}

