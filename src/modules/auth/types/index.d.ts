export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ITokenPayload {
  sub: number;
  email: string;
  name: string;
}

