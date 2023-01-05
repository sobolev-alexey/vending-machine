import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../types';

export const Permissions = (...roles: UserRoles[]) => {
  return SetMetadata('roles', roles);
};
