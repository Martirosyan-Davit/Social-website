import * as argon2 from 'argon2';

export class UtilService {
  static generatePassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static validatePassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(password, hash);
  }
}
