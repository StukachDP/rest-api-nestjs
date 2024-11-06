import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './services/article/article.service';
import { AuthService } from 'src/user/services/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { mockArticleEntity } from './entities/__fixtures__/article-entity.fixture';
import { DeleteResult } from 'typeorm';
import { UserService } from 'src/user/services/user/user.service';
import { PasswordService } from 'src/user/services/password/password.service';
import { JwtService } from 'src/user/services/jwt/jwt.service';
import { UserEntity } from 'src/user/entities/user.entity';

describe('ArticleController', () => {
  let controller: ArticleController;
  let articleService: ArticleService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        ArticleService,
        ConfigService,
        AuthService,
        UserService,
        PasswordService,
        JwtService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    articleService = module.get<ArticleService>(ArticleService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create article method', () => {
    it('should create article', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue({
        id: 0,
        token: 'token',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        passwordHash: 'p',
        articles: [],
      });
      jest.spyOn(articleService, 'createArticle').mockResolvedValue({
        id: 0,
        title: 'Test ARTICLE',
        description: 'This is test article solving problem',
        creationDate: new Date(),
        user: {
          id: 0,
          token: 'token',
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
          passwordHash: 'p',
          articles: [],
        },
      });

      expect(
        await controller.create({
          userEmail: 'email',
          title: 'Test ARTICLE',
          description: 'This is test article solving problem',
        }),
      ).toStrictEqual({
        message: 'Creating article successful',
        article: {
          id: 0,
          title: 'Test ARTICLE',
        },
      });
    });
  });

  describe('update article method', () => {
    it('should update article data', async () => {
      jest.spyOn(articleService, 'updateArticle').mockResolvedValue({
        id: 0,
        title: 'Edit ARTICLE',
        description: 'This is edit article solving problem',
        creationDate: new Date(),
        user: {
          id: 0,
          token: 'token',
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
          passwordHash: 'p',
          articles: [],
        },
      });

      expect(
        await controller.update(0, 'email', {
          title: 'Edit ARTICLE',
          description: 'This is edit article solving problem',
        }),
      ).toStrictEqual({
        message: 'Updating article successful',
        updateData: {
          id: 0,
          title: 'Edit ARTICLE',
          description: 'This is edit article solving problem',
          creationDate: new Date(),
          user: {
            id: 0,
            token: 'token',
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email',
            passwordHash: 'p',
            articles: [],
          },
        },
      });
    });
  });

  describe('delete article method', () => {
    it('should delete user article', async () => {
      const deleteResult = new DeleteResult();
      const id = 0;
      const articleUserEmail = 'email';
      const articleServiceSpy = jest
        .spyOn(articleService, 'deleteArticle')
        .mockResolvedValue(deleteResult);

      expect(await controller.delete(id, articleUserEmail)).toStrictEqual({
        message: 'Deleting article successful',
        reqData: deleteResult,
      });
      expect(articleServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserArticles method', () => {
    it('should retrieve all user articles', async () => {
      const articleServiceSpy = jest
        .spyOn(articleService, 'getUserArticles')
        .mockResolvedValue([mockArticleEntity]);

      expect(await controller.getUserArticles('email')).toStrictEqual({
        message: 'Getting user articles successful',
        userArticleList: [mockArticleEntity],
      });
      expect(articleServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getArticles method', () => {
    it('should retrieve all user articles', async () => {
      const articleServiceSpy = jest
        .spyOn(articleService, 'getArticles')
        .mockResolvedValue([mockArticleEntity]);

      expect(
        await controller.getArticles({
          page: 1,
          pagesize: 10,
          startDate: new Date('2024-01-01'),
          finishDate: new Date('2024-12-31'),
        }),
      ).toStrictEqual({
        message: 'Getting articles successful',
        articleList: [mockArticleEntity],
      });
      expect(articleServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
