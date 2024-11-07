import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  constructor(abstractEntity: AbstractEntity) {
    this.id = abstractEntity.id;
    this.createdAt = abstractEntity.createdAt;
  }
}
