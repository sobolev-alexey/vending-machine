import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User, UserPublic } from '../users/user.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ default: 0 })
  amountAvailable: number;

  @Prop({ default: 0 })
  cost: number;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  shelfLocation: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  sellerId: UserPublic;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
