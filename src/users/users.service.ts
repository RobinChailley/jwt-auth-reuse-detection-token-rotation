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

  createUser(createUserDTO: CreateUserDTO): UserEntity {
    const user = new UserEntity();
    const { email, hashPassword, salt } = createUserDTO;

    user.email = email;
    user.hashPassword = hashPassword;
    user.salt = salt;

    return user;
  }

  async saveUser(user: UserEntity): Promise<void> {
    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
}
