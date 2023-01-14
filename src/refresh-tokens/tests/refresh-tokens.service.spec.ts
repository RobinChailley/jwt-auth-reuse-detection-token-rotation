import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensService } from '@refresh-tokens/refresh-tokens.service';
import { Repository } from 'typeorm';

describe('RefreshTokensService', () => {
  let service: RefreshTokensService;
  let repository: Repository<RefreshTokenEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokensService,
        {
          provide: getRepositoryToken(RefreshTokenEntity),
          useFactory: () => ({}),
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
});
