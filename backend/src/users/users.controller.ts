import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { DepositDto } from './dto/deposit.dto';
import { UsersService } from './users.service';
import { UserPublic } from './user.schema';

type RequestType = {
  user: UserPublic;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/deposit')
  async depositToUserWallet(
    @Request() req: RequestType,
    @Body() depositDto: DepositDto,
  ) {
    return this.usersService.depositToUserWallet(req.user, depositDto);
  }

  @Post('/reset')
  async resetUserWallet(@Request() req: RequestType) {
    return this.usersService.resetUserWallet(req.user);
  }

  @Get()
  async getUser(@Request() req: RequestType) {
    return this.usersService.getUser(req.user);
  }

  @Put()
  async updateUser(
    @Request() req: RequestType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user, updateUserDto);
  }

  @Delete()
  async deleteUser(@Request() req: RequestType) {
    return this.usersService.deleteUser(req.user);
  }
}
