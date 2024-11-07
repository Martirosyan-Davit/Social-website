import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommunicationController } from './communication.controller';
import { CommunicationEntity } from './communication.entity';
import { CommunicationService } from './communication.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommunicationEntity])],
  controllers: [CommunicationController],
  exports: [CommunicationService],
  providers: [CommunicationService],
})
export class CommunicationModule {}
