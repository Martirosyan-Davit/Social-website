import { NotFoundException } from '@nestjs/common';

export class CommunicationNotFoundException extends NotFoundException {
  constructor() {
    super('error.communicationNotFound');
  }
}
