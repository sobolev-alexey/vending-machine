import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { DepositDto } from './dto/deposit.dto';
import { UsersService } from './users.service';
import { RequestType, UserRoles } from '../types';
import { Roles } from '../auth/roles.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(PermissionsGuard)
  @Roles(UserRoles.buyer)
  @Put('/deposit')
  async depositToUserWallet(
    @Request() req: RequestType,
    @Body() depositDto: DepositDto,
  ) {
    return this.usersService.depositToUserWallet(req.user, depositDto);
  }

  @UseGuards(PermissionsGuard)
  @Roles(UserRoles.buyer)
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
