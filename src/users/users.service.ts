import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from '@users/dto/create-user.dto';
import { UserEntity } from '@users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDTO: CreateUserDTO): UserEntity {
    const user = new UserEntity();
    const { email, hashPassword, salt } = createUserDTO;

    user.email = email;
    user.hashPassword = hashPassword;
    user.salt = salt;

    return user;
  }

  async save(user: UserEntity): Promise<void> {
    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByIdOrThrow(id: number): Promise<UserEntity> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new InternalServerErrorException();
    }

    return user;
  }

  async findOneByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new InternalServerErrorException();
    }

    return user;
  }
}
