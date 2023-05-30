import { Expose } from "class-transformer";

export class AuthDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
