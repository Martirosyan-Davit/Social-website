import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from 'src/configs/jwt.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UserModule, JwtModule.register(JwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
