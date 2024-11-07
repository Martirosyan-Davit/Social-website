import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserRoleTypeEnum } from '../../../constants/user-role-type.enum';
import { type UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  age!: number | null;

  @ApiProperty({ enum: UserRoleTypeEnum })
  role!: UserRoleTypeEnum;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName!: string;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.firstName = userEntity.firstName;
    this.lastName = userEntity.lastName;
    this.age = userEntity.age;
    this.role = userEntity.role;
    this.email = userEntity.email;
    this.fullName = userEntity.fullName;
  }
}
