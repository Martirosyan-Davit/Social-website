import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { CommunicationStatusTypeEnum } from '../../../constants/communication-status-type.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class CommunicationPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: CommunicationStatusTypeEnum })
  @IsEnum(CommunicationStatusTypeEnum)
  @IsOptional()
  status?: CommunicationStatusTypeEnum;
}
