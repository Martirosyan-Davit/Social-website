import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { OrderTypeEnum } from 'src/constants/order-type.enum';

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: OrderTypeEnum, default: OrderTypeEnum.ASC })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  readonly order?: OrderTypeEnum = OrderTypeEnum.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly search?: string;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
