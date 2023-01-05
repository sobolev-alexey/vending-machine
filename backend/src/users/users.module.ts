import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<User & Document>('save', async function (next) {
            const user = this; // eslint-disable-line @typescript-eslint/no-this-alias
            user.password = await bcrypt.hash(user.password, 8);
            next();
          });

          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
