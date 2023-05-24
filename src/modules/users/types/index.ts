export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export class IUpdateUser {
  name?: string;
  email?: string;
  password?: string;
  hashedRefreshToken?: string;
}

export class IFindUnique {
  id?: number;
  email?: string;
}

