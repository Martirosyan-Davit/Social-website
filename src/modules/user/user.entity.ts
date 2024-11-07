import { Column, Entity, OneToMany, Unique, VirtualColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserRoleTypeEnum } from '../../constants/user-role-type.enum';
import { CommunicationEntity } from '../communication/communication.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  firstName!: string;

  @Column({ type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar', nullable: true })
  age!: number | null;

  @Column({
    type: 'enum',
    enum: UserRoleTypeEnum,
    default: UserRoleTypeEnum.USER,
  })
  role!: UserRoleTypeEnum;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @VirtualColumn({
    type: 'varchar',
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToMany(
    () => CommunicationEntity,
    (communication) => communication.follower,
  )
  followers?: CommunicationEntity[];

  @OneToMany(
    () => CommunicationEntity,
    (communication) => communication.following,
  )
  followings?: CommunicationEntity[];
}
