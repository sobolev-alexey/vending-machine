import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { Public } from './public.metadata';
import { LocalGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() credentialsDto: CredentialsDto) {
    return this.authService.register(credentialsDto);
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Body() credentialsDto: CredentialsDto) {
    return this.authService.login(credentialsDto);
  }
}
