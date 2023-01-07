import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { Public } from './public.metadata';
import { LocalGuard } from './local.guard';
import { User } from '../users/user.schema';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    type: User,
  })
  @Public()
  @Post('register')
  async register(@Body() credentialsDto: CredentialsDto) {
    return this.authService.register(credentialsDto);
  }

  @ApiResponse({
    status: 201,
    type: User,
  })
  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.login(credentialsDto);
  }
}
