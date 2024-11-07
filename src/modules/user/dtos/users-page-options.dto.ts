import { IsNumber, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UsersPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age?: number;
}
