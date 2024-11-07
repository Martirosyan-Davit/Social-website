import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dtos/user.dto';

export class LoginPayloadDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty()
  token: string;

  constructor(user: UserDto, token: string) {
    this.user = user;
    this.token = token;
  }
}
