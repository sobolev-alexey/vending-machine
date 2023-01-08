import mongoose from 'mongoose';
import { UserPublic } from '../../src/users/user.schema';
import { UserRoles } from '../../src/types';

export const UserStub = ({
  deposit,
  role = UserRoles.buyer,
}: {
  deposit?: number;
  role?: UserRoles;
}): UserPublic => {
  return {
    _id: new mongoose.Types.ObjectId('63b9a199d98dc161bced8a65'),
    role,
    deposit,
    total: 0,
    username: 'Alex',
  };
};
