import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CommunicationService } from './communication.service';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CommunicationDto } from './dtos/communication.dto';
import { CreateCommunicationDto } from './dtos/create-communication.dto';
import { RespondCommunicationDto } from './dtos/respond-communication.dto';
import { PageDto } from '../../common/dto/page.dto';
import { CommunicationPageOptionsDto } from './dtos/communication-page-options.dto';

@Controller('communications')
@ApiTags('communications')
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Sends a follow request.',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiCreatedResponse({
    type: CommunicationDto,
  })
  @ApiBearerAuth()
  async sendFollowRequest(
    @Body() createCommunicationDto: CreateCommunicationDto,
    @Request() req: any,
  ) {
    await this.communicationService.sendFollowRequest(
      req.user.id,
      createCommunicationDto.recipientId,
    );
  }

  @Patch(':id/respond')
  @ApiOperation({
    summary: 'Accepts or declines a follow request.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CommunicationDto,
  })
  @ApiBearerAuth()
  async respondToFollowRequest(
    @Param('id') communicationId: string,
    @Request() req: any,
    @Body() respondCommunicationDto: RespondCommunicationDto,
  ) {
    await this.communicationService.respondToFollowRequest(
      communicationId,
      req.user.id,
      respondCommunicationDto.accept,
    );
  }

  @Get('my')
  @ApiOperation({
    summary: 'Get user follow  whit pagination',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: PageDto,
  })
  @ApiBearerAuth()
  async getMyFollows(
    @Query() communicationPageOptionsDto: CommunicationPageOptionsDto,
    @Request() req: any,
  ): Promise<PageDto<CommunicationDto>> {
    return this.communicationService.getMyFollows(
      communicationPageOptionsDto,
      req.user.id,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get follow by id',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CommunicationDto,
  })
  @ApiBearerAuth()
  async getOne(
    @Param('id') communicationId: string,
    @Request() req: any,
  ): Promise<CommunicationDto> {
    return this.communicationService.getOne(communicationId, req.user.id);
  }
}
