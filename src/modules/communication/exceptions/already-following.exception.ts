import { BadRequestException } from '@nestjs/common';

export class AlreadyFollowingException extends BadRequestException {
  constructor() {
    super('error.alreadyFollowing');
  }
}
