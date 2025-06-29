import jwt, { JwtPayload } from 'jsonwebtoken';

class LocalAuth {
  private static signToken = (data: object, authKey: string): string =>
    jwt.sign(data, authKey);
  private static verifyToken = (
    token: string,
    authKey: string,
  ): JwtPayload | string => jwt.verify(token, authKey);

  static signUser = (data: object): string =>
    this.signToken(data, process.env.AUTH_KEY!);
  
  static verifyUser = (token: string): JwtPayload | string =>
    this.verifyToken(token, process.env.AUTH_KEY!);
}

export default LocalAuth;
