import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { IUser } from "../types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "refreshToken-secret",
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IUser) {
    const refreshToken = req.get("authorization").replace("Bearer", "").trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
