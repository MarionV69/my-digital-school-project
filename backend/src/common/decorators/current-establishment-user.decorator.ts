import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserWithEstablishment } from '../types/user-with-establishment.type';
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

export const CurrentEstablishmentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserWithEstablishment => {
    const request: Express.Request & { user?: AuthenticatedUser } = ctx
      .switchToHttp()
      .getRequest();

    const user = request.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException('User must have an establishment');
    }

    return user as UserWithEstablishment;
  },
);
