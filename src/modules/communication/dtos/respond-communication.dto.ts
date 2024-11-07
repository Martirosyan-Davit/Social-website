import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class RespondCommunicationDto {
  @ApiProperty()
  @IsBoolean()
  accept!: boolean;
}
