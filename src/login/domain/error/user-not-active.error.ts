import { ForbiddenException } from '@nestjs/common';

export class UserNotActiveError extends ForbiddenException {
  message = 'User is not active';
}
