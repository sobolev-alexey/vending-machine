import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

import { UserRoles } from '../types';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty()
  @Prop({ required: true })
  username: string;

  @ApiProperty()
  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty()
  @Prop({ default: 0 })
  deposit: number;

  @ApiProperty()
  @Prop({ default: 0 })
  total: number;

  @ApiProperty()
  @Prop({ enum: Object.values(UserRoles), default: UserRoles.buyer })
  role: UserRoles;
}

export interface UserPublic extends Omit<User, 'password'> {
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
