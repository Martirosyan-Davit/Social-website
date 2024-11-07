import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { UserDto } from '../user/dtos/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User Registration',
    description:
      'Registers a new user in the system and returns an access token for authenticated access.',
  })
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Successfully Registered',
  })
  userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.registration(userRegisterDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description:
      'Authenticates a user by verifying their credentials and returns an access token for accessing protected routes.',
  })
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  userLogin(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(userLoginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  @ApiBearerAuth()
  getCurrentUser(@Request() req: any): UserDto {
    return req.user;
  }
}
