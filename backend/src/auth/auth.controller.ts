import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

import { UserPublic } from '../users/user.schema';

type RequestType = {
  user: UserPublic;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() credentialsDto: CredentialsDto) {
    return this.authService.register(credentialsDto);
  }

  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.login(credentialsDto);
  }
}
