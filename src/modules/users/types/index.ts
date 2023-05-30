export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export class IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  hashedRefreshToken?: string;
  passwordToken?: string;
  passwordTokenExpiresAt?: Date;
}

export class IFindUnique {
  id?: number;
  email?: string;
}
