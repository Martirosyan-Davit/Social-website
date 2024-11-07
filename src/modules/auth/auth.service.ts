import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleTypeEnum } from 'src/constants/user-role-type.enum';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async registration(userLoginDto: UserRegisterDto): Promise<LoginPayloadDto> {
    const userDto = await this.userService.create(userLoginDto);

    const token = this.generateToken({
      userId: userDto.id,
      role: userDto.role,
    });

    return new LoginPayloadDto(userDto, token);
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userDto = await this.userService.login(userLoginDto);

    const token = this.generateToken({
      userId: userDto.id,
      role: userDto.role,
    });

    return new LoginPayloadDto(userDto, token);
  }

  private generateToken(payload: { userId: string; role: UserRoleTypeEnum }) {
    return this.jwtService.sign(payload);
  }
}
