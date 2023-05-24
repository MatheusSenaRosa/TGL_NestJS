import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto, AuthDto, SigninDto } from "./dtos";
import { Serialize } from "../../interceptors";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(AuthDto)
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Serialize(AuthDto)
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
}

