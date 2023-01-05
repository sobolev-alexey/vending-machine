import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { DepositDto } from './dto/deposit.dto';
import { User, UserDocument, UserPublic } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async depositToUserWallet(user: UserPublic, depositDto: DepositDto) {
    const userData = await this.userModel.findById(user._id).exec();

    await this.userModel
      .findByIdAndUpdate(user._id, {
        $set: { deposit: userData.deposit + depositDto.deposit },
      })
      .exec();

    return this.userModel.findById(user._id).exec();
  }

  async resetUserWallet(user: UserPublic) {
    await this.userModel.findByIdAndUpdate(user._id, { deposit: 0 }).exec();
    return this.userModel.findById(user._id).exec();
  }

  async getUser(user: UserPublic): Promise<UserPublic> {
    return this.userModel.findById(user._id).exec();
  }

  async updateUser(
    user: UserPublic,
    updateUserDto: UpdateUserDto,
  ): Promise<UserPublic> {
    const shouldUpdateProp = Object.keys(updateUserDto).every(
      (param) => param === 'username',
    );

    if (!shouldUpdateProp) {
      throw new HttpException('Not allowed', HttpStatus.METHOD_NOT_ALLOWED);
    }

    return this.userModel.findByIdAndUpdate(user._id, updateUserDto).exec();
  }

  async deleteUser(user: UserPublic): Promise<UserPublic> {
    return this.userModel.findByIdAndDelete(user._id).exec();
  }
}
