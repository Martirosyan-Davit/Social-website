import { NotFoundException } from '@nestjs/common';

export class FollowRequestAlreadySentException extends NotFoundException {
  constructor() {
    super('error.followRequestAlreadySent');
  }
}
