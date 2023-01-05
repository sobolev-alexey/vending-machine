import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserPublic, User, UserDocument } from '../users/user.schema';
import { CredentialsDto } from './dto/credentials.dto';

// https://www.codemag.com/Article/2001081/Nest.js-Step-by-Step-Part-3-Users-and-Authentication

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserPublic> {
    const user = await this.userModel
      .findOne({ username })
      .select('+password')
      .exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const response = user.toObject<User>();
    delete response.password;
    return response;
  }

  async register(credentialsDto: CredentialsDto): Promise<UserPublic> {
    const user = await this.userModel.findOne({
      username: credentialsDto.username,
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = new this.userModel({
      ...credentialsDto,
    });

    const registeredUser = (await newUser.save()).toObject<User>();
    delete registeredUser.password;

    return registeredUser;
  }

  async login(credentialsDto: CredentialsDto) {
    const existingUser = await this.userModel.findOne({
      username: credentialsDto.username,
    });
    const hashedPassword = await bcrypt.hash(credentialsDto.password, 8);

    if (!existingUser || hashedPassword !== existingUser.password) {
      throw new HttpException('Wrong login credentials', HttpStatus.CONFLICT);
    }

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}
