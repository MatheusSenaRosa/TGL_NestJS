export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  roleId: number;
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

