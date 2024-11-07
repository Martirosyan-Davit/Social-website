import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from '../../common/dto/page.dto';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../../guards/jwt-guard';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get users whit pagination',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PageDto,
  })
  async getAll(
    @Query() userPageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getAll(userPageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  async getOne(@Param('id') userId: string): Promise<UserDto> {
    return this.userService.getOne(userId);
  }

  @Put()
  @ApiOperation({
    summary: 'Update user',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Updated user',
  })
  @ApiBearerAuth()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ): Promise<void> {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
