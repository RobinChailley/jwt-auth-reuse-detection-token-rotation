import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({}),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and assign user properties', () => {
      expect.assertions(4);
      const user = service.create({
        email: 'email',
        hashPassword: 'hash',
        salt: 'salt',
      });

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.email).toBe('email');
      expect(user.hashPassword).toBe('hash');
      expect(user.salt).toBe('salt');
    });
  });

  describe('save', () => {
    let user: UserEntity;
    beforeEach(() => {
      user = new UserEntity();
      user.save = jest.fn();
    });

    it('should call entity.save()', async () => {
      await service.save(user);

      expect(user.save).toBeCalled();
    });

    it('shoud throw if entity.save() fails', async () => {
      user.save = jest.fn().mockRejectedValue(new Error());

      await expect(service.save(user)).rejects.toThrowError();
    });
  });

  describe('findOneByEmail', () => {
    beforeEach(() => {
      repository.findOne = jest.fn();
    });

    it('should call repository.findOne', async () => {
      await service.findOneByEmail('test');

      expect(repository.findOne).toBeCalledWith({ where: { email: 'test' } });
    });
  });

  describe('findOneById', () => {
    beforeEach(() => {
      repository.findOne = jest.fn();
    });

    it('should call repository.findOne', async () => {
      await service.findOneById(30);

      expect(repository.findOne).toBeCalledWith({ where: { id: 30 } });
    });
  });
});
