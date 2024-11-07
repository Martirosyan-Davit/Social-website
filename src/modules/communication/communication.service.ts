import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommunicationStatusTypeEnum } from '../../constants/communication-status-type.enum';
import { CommunicationEntity } from './communication.entity';
import { CommunicationDto } from './dtos/communication.dto';
import { AlreadyFollowingException } from './exceptions/already-following.exception';
import { CommunicationNotFoundException } from './exceptions/communication-not-found.exceptions';
import { FollowRequestAlreadySentException } from './exceptions/follow-request-already-sent.exception';
import { PageDto } from '../../common/dto/page.dto';
import { CommunicationPageOptionsDto } from './dtos/communication-page-options.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(CommunicationEntity)
    private communicationRepository: Repository<CommunicationEntity>,
  ) {}

  async sendFollowRequest(
    senderId: string,
    recipientId: string,
  ): Promise<CommunicationDto> {
    await this.checkFollowRequest(senderId, recipientId);

    const communicationEntity = this.communicationRepository.create({
      followerId: senderId,
      followingId: recipientId,
    });

    await this.communicationRepository.save(communicationEntity);

    return new CommunicationDto(communicationEntity);
  }

  async respondToFollowRequest(
    communicationId: string,
    userId: string,
    accept: boolean,
  ) {
    const communicationEntity = await this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.id = :id', { id: communicationId })
      .andWhere('communication.followingId = :followingId', {
        followingId: userId,
      })
      .andWhere('communication.status = :status', {
        status: CommunicationStatusTypeEnum.PENDING,
      })
      .getOne();

    if (!communicationEntity) {
      throw new CommunicationNotFoundException();
    }

    communicationEntity.status = accept
      ? CommunicationStatusTypeEnum.ACCEPTED
      : CommunicationStatusTypeEnum.DECLINED;

    await this.communicationRepository.save(communicationEntity);
  }

  async getMyFollows(
    communicationPageOptionsDto: CommunicationPageOptionsDto,
    userId: string,
  ): Promise<PageDto<CommunicationDto>> {
    const queryBuilder = this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.followingId = :followingId', {
        followingId: userId,
      })
      .leftJoinAndSelect('communication.follower', 'follower')
      .leftJoinAndSelect('communication.following', 'following');

    if (communicationPageOptionsDto.status) {
      queryBuilder.andWhere('communication.status = :status', {
        status: communicationPageOptionsDto.status,
      });
    }

    queryBuilder
      .orderBy('communication.createdAt', communicationPageOptionsDto.order)
      .skip(communicationPageOptionsDto.skip)
      .take(communicationPageOptionsDto.take);

    const [items, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: communicationPageOptionsDto,
    });

    return new PageDto(
      items.map((item) => new CommunicationDto(item)),
      pageMetaDto,
    );
  }

  async getOne(
    communicationId: string,
    userId: string,
  ): Promise<CommunicationDto> {
    const communicationEntity = await this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.id = :communicationId', { communicationId })
      .andWhere('communication.followingId = :followingId', {
        followingId: userId,
      })
      .getOne();

    if (!communicationEntity) {
      throw new CommunicationNotFoundException();
    }

    return new CommunicationDto(communicationEntity);
  }

  private async checkFollowRequest(senderId: string, recipientId: string) {
    const queryBuilder = this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.followerId = :senderId', { senderId })
      .andWhere('communication.followingId = :recipientId', { recipientId });

    const isAlreadySent = await queryBuilder
      .andWhere('communication.status = :status', {
        status: CommunicationStatusTypeEnum.PENDING,
      })
      .getOne();

    if (isAlreadySent) {
      throw new FollowRequestAlreadySentException();
    }

    const isAlreadyFollowing = await queryBuilder
      .andWhere('communication.status = :status', {
        status: CommunicationStatusTypeEnum.ACCEPTED,
      })
      .getOne();

    if (isAlreadyFollowing) {
      throw new AlreadyFollowingException();
    }
  }
}
