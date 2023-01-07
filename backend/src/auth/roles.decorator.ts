import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../types';

// https://docs.nestjs.com/guards
export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
