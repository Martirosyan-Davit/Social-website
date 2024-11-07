import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CommunicationStatusTypeEnum } from '../../constants/communication-status-type.enum';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'communications' })
export class CommunicationEntity extends AbstractEntity {
  @Column({ type: 'uuid' })
  followerId!: string;

  @Column({ type: 'uuid' })
  followingId!: string;

  @Column({
    type: 'enum',
    enum: CommunicationStatusTypeEnum,
    default: CommunicationStatusTypeEnum.PENDING,
  })
  status!: CommunicationStatusTypeEnum;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({ name: 'followerId' })
  follower?: UserEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.followings)
  @JoinColumn({ name: 'followingId' })
  following?: UserEntity | null;
}
