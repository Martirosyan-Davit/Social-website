import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConfig } from '../../configs/jwt.config';
import { UserRoleTypeEnum } from 'src/constants/user-role-type.enum';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dtos/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.publicKey,
    });
  }

  async validate(payload: { userId: string; userRole: UserRoleTypeEnum }) {
    const userEntity = await this.userService.findAuth(payload.userId);

    if (!userEntity) {
      throw new UnauthorizedException();
    }
    return new UserDto(userEntity);
  }
}
