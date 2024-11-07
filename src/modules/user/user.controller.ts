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
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Get users whit pagination',
    type: PageDto,
  })
  async getAll(
    @Query() userPageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.getAll(userPageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user by id',
    type: UserDto,
  })
  async getOne(@Param('id') userId: string): Promise<UserDto> {
    return this.userService.getOne(userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    description: 'Update user',
  })
  @ApiBearerAuth()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ): Promise<void> {
    return this.userService.update(req.user.id, updateUserDto);
  }
}
