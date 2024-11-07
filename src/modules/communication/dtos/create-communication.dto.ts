import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommunicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipientId!: string;
}
