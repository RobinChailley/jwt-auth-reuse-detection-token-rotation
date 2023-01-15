import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensService } from '@refresh-tokens/refresh-tokens.service';
import { UserEntity } from '@users/entities/user.entity';
import { Repository } from 'typeorm';

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;
  let repository: Repository<RefreshTokenEntity>;
  const user = new UserEntity();
  user.id = 30;
  const refreshToken = new RefreshTokenEntity();
  refreshToken.refreshToken = 'token';
  refreshToken.user = user;
  refreshToken.save = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensService,
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RefreshTokensService>(RefreshTokensService);
    repository = module.get(getRepositoryToken(RefreshTokenEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createAndSave', () => {
    it('should create and save a refresh token', async () => {
      expect.assertions(2);
      service.create = jest.fn().mockReturnValue(refreshToken);
      service.save = jest.fn();

      const result = await service.createAndSave(user, 'refreshToken');

      expect(service.create).toBeCalledWith(user, 'refreshToken');
      expect(result).toBe(refreshToken);
    });
  });

  describe('create', () => {
    it('should create a refresh token', () => {
      expect.assertions(3);
      const result = service.create(user, 'refreshToken');

      expect(result).toBeInstanceOf(RefreshTokenEntity);
      expect(result.refreshToken).toBe('refreshToken');
      expect(result.user).toBe(user);
    });
  });

  describe('save', () => {
    it('should save refresh token', () => {
      service.save(refreshToken);

      expect(refreshToken.save).toBeCalled();
    });

    it('should throw an error if save fails', () => {
      expect.assertions(1);
      refreshToken.save = jest.fn().mockRejectedValue(new Error());

      expect(service.save(refreshToken)).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find one refresh token', async () => {
      expect.assertions(2);
      repository.findOne = jest.fn().mockResolvedValue(refreshToken);

      const result = await service.findOne('token', user);

      expect(result).toBe(refreshToken);
      expect(repository.findOne).toBeCalledWith({
        where: { refreshToken: 'token', user: { id: user.id } },
      });
    });
  });

  describe('deleteOne', () => {
    it('should delete one refresh token', async () => {
      expect.assertions(1);
      refreshToken.remove = jest.fn();

      await service.deleteOne(refreshToken);

      expect(refreshToken.remove).toBeCalled();
    });

    it('should throw an error if delete fails', () => {
      expect.assertions(1);
      refreshToken.remove = jest.fn().mockRejectedValue(new Error());

      expect(service.deleteOne(refreshToken)).rejects.toThrow();
    });
  });

  describe('deleteAllOfUser', () => {
    it('should delete all refresh tokens of user', async () => {
      expect.assertions(1);
      repository.delete = jest.fn();

      await service.deleteAllOfUser(user);

      expect(repository.delete).toBeCalledWith({ user: { id: user.id } });
    });

    it('should throw an error if delete fails', () => {
      expect.assertions(1);
      repository.delete = jest.fn().mockRejectedValue(new Error());

      expect(service.deleteAllOfUser(user)).rejects.toThrow();
    });
  });
});
