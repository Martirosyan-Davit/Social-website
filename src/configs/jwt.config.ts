import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

export const JwtConfig: JwtModuleOptions = {
  privateKey: String(process.env.JWT_PRIVATE_KEY)
    .replaceAll(String.raw`\n`, '\n')
    .trim(),
  publicKey: String(process.env.JWT_PUBLIC_KEY)
    .replaceAll(String.raw`\n`, '\n')
    .trim(),
  signOptions: {
    algorithm: 'RS256',
  },
  verifyOptions: {
    algorithms: ['RS256'],
  },
};
