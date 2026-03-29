import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';

@Injectable()
export class EstablishmentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedUser }>();

    const user = request.user;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    if (!user.establishmentId || !user.establishmentType) {
      throw new ForbiddenException('You must create an establishment first');
    }

    return true;
  }
}
