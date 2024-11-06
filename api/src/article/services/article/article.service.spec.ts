import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/services/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordService } from 'src/user/services/password/password.service';
import { JwtService } from 'src/user/services/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { mockArticleEntity } from 'src/article/entities/__fixtures__/article-entity.fixture';
import { ArticleEntity } from 'src/article/entities/article.entity';
import { ArticleService } from './article.service';
import { AuthService } from 'src/user/services/auth/auth.service';
import { UserEntity } from 'src/user/entities/user.entity';

describe('ArticleService', () => {
  let service: ArticleService;
  let repo: Repository<ArticleEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        AuthService,
        UserService,
        ConfigService,
        PasswordService,
        JwtService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repo = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to check article existence', async () => {
    const findOneSpy = jest
      .spyOn(repo, 'findOne')
      .mockResolvedValue(mockArticleEntity);

    expect(await service.isArticleExists(0)).toBe(mockArticleEntity);
    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        id: 0,
      },
    });
  });
});
