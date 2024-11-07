import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { UserDto } from './dtos/user.dto';
import { UserLoginDto } from '../auth/dto/user-login.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exceptions';
import { UtilService } from '../../util/util.service';
import { PageDto } from '../../common/dto/page.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAuth(id: string): Promise<UserEntity | undefined> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return userEntity;
  }

  async create(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    await this.checkEmail(userRegisterDto.email);

    const userEntity = this.userRepository.create({
      ...userRegisterDto,
      password: await UtilService.generatePassword(userRegisterDto.password),
    });

    await this.userRepository.save(userEntity);

    return new UserDto(userEntity);
  }

  async login(userLoginDto: UserLoginDto): Promise<UserDto> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userLoginDto.email })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await UtilService.validatePassword(
      userEntity.password,
      userLoginDto.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return new UserDto(userEntity);
  }

  async getAll(
    userPageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (userPageOptionsDto.age) {
      queryBuilder.andWhere('user.age = :age', { age: userPageOptionsDto.age });
    }

    if (userPageOptionsDto.search) {
      const searchTerm = `${userPageOptionsDto.search.trim()}%`;
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName ILIKE :searchTerm', { searchTerm }).orWhere(
            'user.lastName ILIKE :searchTerm',
            { searchTerm },
          );
        }),
      );
    }

    queryBuilder
      .orderBy('user.createdAt', userPageOptionsDto.order)
      .skip(userPageOptionsDto.skip)
      .take(userPageOptionsDto.take);

    const [entities, itemCount] = await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: userPageOptionsDto,
    });

    return new PageDto(
      entities.map((entity) => new UserDto(entity)),
      pageMetaDto,
    );
  }

  async getOne(userId: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return new UserDto(userEntity);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    this.userRepository.merge(userEntity, updateUserDto);

    await this.userRepository.save(userEntity);
  }

  private async checkEmail(email: string) {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (userEntity) {
      throw new BadRequestException();
    }
  }
}
