import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommunicationStatusTypeEnum } from '../../../constants/communication-status-type.enum';
import { UserDto } from '../../user/dtos/user.dto';
import { type CommunicationEntity } from '../communication.entity';

export class CommunicationDto extends AbstractDto {
  @ApiProperty()
  followerId!: string;

  @ApiProperty()
  followingId!: string;

  @ApiProperty({ enum: CommunicationStatusTypeEnum })
  status!: CommunicationStatusTypeEnum;

  @ApiPropertyOptional({ type: UserDto })
  follower?: UserDto;

  @ApiPropertyOptional({ type: UserDto })
  following?: UserDto;

  constructor(communicationEntity: CommunicationEntity) {
    super(communicationEntity);
    this.followerId = communicationEntity.followerId;
    this.followingId = communicationEntity.followingId;
    this.status = communicationEntity.status;
    this.follower = communicationEntity.follower
      ? new UserDto(communicationEntity.follower)
      : null;
    this.following = communicationEntity.following
      ? new UserDto(communicationEntity.following)
      : null;
  }
}
