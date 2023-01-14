import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@refresh-tokens/entities/refresh-token.entity';
import { UserEntity } from '@users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  createAndSave(
    user: UserEntity,
    _refreshToken: string,
  ): Promise<RefreshTokenEntity> {
    const refreshToken = this.create(user, _refreshToken);

    return refreshToken.save();
  }

  create(user: UserEntity, _refreshToken: string): RefreshTokenEntity {
    const refreshToken = new RefreshTokenEntity();

    refreshToken.refreshToken = _refreshToken;
    refreshToken.user = user;

    return refreshToken;
  }

  async save(refreshToken: RefreshTokenEntity): Promise<void> {
    try {
      await refreshToken.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    refreshToken: string,
    user: UserEntity,
  ): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.findOne({
      where: { refreshToken, user: { id: user.id } },
    });
  }

  async deleteOne(refreshTokenEntity: RefreshTokenEntity): Promise<void> {
    try {
      await refreshTokenEntity.remove();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAllOfUser(user: UserEntity): Promise<void> {
    try {
      await this.refreshTokenRepository.delete({ user: { id: user.id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
