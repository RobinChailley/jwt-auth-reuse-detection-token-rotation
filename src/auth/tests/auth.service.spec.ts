import { AuthService } from '@auth/auth.service';
import { RefreshTokenDTO } from '@auth/dto/refresh-token.dto';
import { SignInDTO } from '@auth/dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokensService } from '@refresh-tokens/refresh-tokens.service';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let refreshTokensService: RefreshTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: () => ({}) },
        { provide: JwtService, useFactory: () => ({}) },
        { provide: RefreshTokensService, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    refreshTokensService =
      module.get<RefreshTokensService>(RefreshTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(refreshTokensService).toBeDefined();
  });

  describe('signin', () => {
    let signInDto: SignInDTO;

    beforeEach(() => {
      signInDto = {
        email: 'test@test.com',
        password: 'Test123@',
      };
    });

    it('should throw if user is not found', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.signin(signInDto)).rejects.toThrow();
    });

    it('should throw if password is not valid', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue({
        hashPassword: 'hashPassword',
      });
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(service.signin(signInDto)).rejects.toThrow();
    });

    it('should return tokens if user is found and password is valid', async () => {
      expect.assertions(2);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      service['generateTokensAndSave'] = jest.fn().mockReturnValue('token');
      usersService.findOneByEmail = jest.fn().mockResolvedValue({
        hashPassword: 'hashPassword',
      });

      const token = await service.signin(signInDto);

      expect(service['generateTokensAndSave']).toBeCalledWith({
        hashPassword: 'hashPassword',
      });
      expect(token).toStrictEqual('token');
    });
  });

  describe('signup', () => {
    let signInDto: SignInDTO;

    beforeEach(() => {
      signInDto = {
        email: 'test@test.com',
        password: 'Test123@',
      };

      jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => 'salt');
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hash');
      usersService.create = jest.fn().mockReturnValue('user');
      usersService.save = jest.fn();
      service['generateTokensAndSave'] = jest.fn().mockReturnValue('token');
    });

    it('should generate salt and hash', async () => {
      expect.assertions(2);

      await service.signup(signInDto);

      expect(bcrypt.genSalt).toBeCalled();
      expect(bcrypt.hash).toBeCalledWith(signInDto.password, 'salt');
    });

    it('should create user', async () => {
      expect.assertions(1);

      await service.signup(signInDto);

      expect(usersService.create).toBeCalledWith({
        email: signInDto.email,
        hashPassword: 'hash',
        salt: 'salt',
      });
    });

    it('should save user', async () => {
      expect.assertions(1);

      await service.signup(signInDto);

      expect(usersService.save).toBeCalledWith('user');
    });

    it('should return tokens', async () => {
      expect.assertions(1);

      const token = await service.signup(signInDto);

      expect(token).toStrictEqual('token');
    });
  });

  describe('refresh', () => {
    let refreshTokenDTO: RefreshTokenDTO;

    beforeEach(() => {
      refreshTokenDTO = {
        refreshToken: 'refreshToken',
      };

      usersService.findOneById = jest.fn().mockResolvedValue('user');
      refreshTokensService.findOne = jest
        .fn()
        .mockResolvedValue('refreshToken');
      refreshTokensService.deleteOne = jest.fn();
      refreshTokensService.deleteAllOfUser = jest.fn();
      service['generateTokensAndSave'] = jest.fn().mockResolvedValue('tokens');
      jwtService.verify = jest.fn().mockReturnValue({ id: 'user' });
    });

    it('should throw if user is not found', async () => {
      usersService.findOneById = jest.fn().mockResolvedValue(null);

      await expect(service.refresh(refreshTokenDTO)).rejects.toThrow();
    });

    it('should delete all users token and throw if refresh token is not found', async () => {
      refreshTokensService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.refresh(refreshTokenDTO)).rejects.toThrow();
      expect(refreshTokensService.deleteAllOfUser).toBeCalledWith('user');
    });

    it('should delete the old refresh token', async () => {
      await service.refresh(refreshTokenDTO);

      expect(refreshTokensService.deleteOne).toBeCalledWith('refreshToken');
    });

    it('should generate new tokens', async () => {
      await service.refresh(refreshTokenDTO);

      expect(service['generateTokensAndSave']).toBeCalledWith('user');
    });
  });

  describe('logout', () => {
    let refreshTokenDTO: RefreshTokenDTO;

    beforeEach(() => {
      refreshTokenDTO = {
        refreshToken: 'refreshToken',
      };
      jwtService.verify = jest.fn().mockReturnValue({ id: 'user' });
      usersService.findOneById = jest.fn().mockResolvedValue('user');
      refreshTokensService.findOneOrThrow = jest
        .fn()
        .mockResolvedValue('refreshToken');
      refreshTokensService.deleteOne = jest.fn();
    });

    it('should throw if user is not found', async () => {
      usersService.findOneById = jest.fn().mockResolvedValue(null);

      await expect(service.logout(refreshTokenDTO)).rejects.toThrow();
    });

    it('should find and delete the refresh token', async () => {
      await service.logout(refreshTokenDTO);

      expect(refreshTokensService.findOneOrThrow).toBeCalledWith(
        'refreshToken',
        'user',
      );

      expect(refreshTokensService.deleteOne).toBeCalledWith('refreshToken');
    });
  });

  describe('generateTokens', () => {
    let user: UserEntity;

    beforeEach(() => {
      user = new UserEntity();
      user.id = 30;
    });

    it('should call sign with expires in and user.id', () => {
      jwtService.sign = jest.fn();

      service['generateToken'](user, '10m');

      expect(jwtService.sign).toBeCalledWith({ id: 30 }, { expiresIn: '10m' });
    });
  });

  describe('generateTokensAndSave', () => {
    let user: UserEntity;

    beforeEach(() => {
      user = new UserEntity();
      service['generateToken'] = jest.fn().mockReturnValue('token');
      refreshTokensService.createAndSave = jest.fn();
    });

    it('should call twice generateToken', () => {
      service['generateTokensAndSave'](user);

      expect(service['generateToken']).toBeCalledTimes(2);
    });

    it('should call createAndSave with user and refreshToken', () => {
      service['generateTokensAndSave'](user);

      expect(refreshTokensService.createAndSave).toBeCalledWith(user, 'token');
    });

    it('should return tokens', async () => {
      const tokens = await service['generateTokensAndSave'](user);

      expect(tokens).toStrictEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
    });
  });
});
