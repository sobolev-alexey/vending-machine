import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoles } from '../types';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 0 })
  deposit: number;

  @Prop({ enum: Object.values(UserRoles), default: UserRoles.buyer })
  role: UserRoles;
}

export interface UserPublic extends Omit<User, 'password'> {
  _id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
