import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    if (user.role !== "Administrator") throw new UnauthorizedException();

    return true;
  }
}
