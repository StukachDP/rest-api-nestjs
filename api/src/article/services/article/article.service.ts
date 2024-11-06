import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/article/entities/article.entity';
import { Between, DeleteResult, ILike, Repository } from 'typeorm';
import { CreateArticleDto } from 'src/article/dto/create-article.dto';
import { UpdateArticleDto } from 'src/article/dto/update-article.dto';
import { GetArticleFilterDto } from 'src/article/dto/get-article-filter.dto';
import { UserService } from 'src/user/services/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articlesRepository: Repository<ArticleEntity>,
    private readonly userService: UserService,
  ) {}

  async isArticleExists(id: number): Promise<ArticleEntity | null> {
    return this.articlesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async createArticle(articleDto: CreateArticleDto): Promise<ArticleEntity> {
    const userPayload = await this.userService.isUserExists(
      articleDto.userEmail,
    );
    if (!userPayload) {
      throw new HttpException('User is not exists', HttpStatus.BAD_REQUEST);
    }

    const articlePayload = {
      title: articleDto.title,
      description: articleDto.description,
      creationDate: new Date(),
      user: userPayload,
    };

    return await this.articlesRepository.save(articlePayload);
  }

  async updateArticle(
    id: number,
    userEmail: string,
    updateForm: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const userPayload = await this.userService.isUserExists(userEmail);
    const articlePayload = await this.isArticleExists(id);
    if (!userPayload) {
      throw new HttpException('User is not exists', HttpStatus.BAD_REQUEST);
    }
    if (!articlePayload) {
      throw new HttpException('Article is not exists', HttpStatus.BAD_REQUEST);
    }

    articlePayload.title = updateForm.title
      ? updateForm.title
      : articlePayload.title;
    articlePayload.description = updateForm.description
      ? updateForm.description
      : articlePayload.description;

    return await this.articlesRepository.save(articlePayload);
  }

  async deleteArticle(id: number, userEmail: string): Promise<DeleteResult> {
    const userPayload = await this.userService.isUserExists(userEmail);
    const articlePayload = await this.isArticleExists(id);
    if (!userPayload) {
      throw new HttpException('User is not exists', HttpStatus.BAD_REQUEST);
    }
    if (!articlePayload) {
      throw new HttpException('Article is not exists', HttpStatus.BAD_REQUEST);
    }

    return await this.articlesRepository.delete(id);
  }

  async getUserArticles(userEmail: string): Promise<ArticleEntity[]> {
    const userPayload = await this.userService.isUserExists(userEmail);
    if (!userPayload) {
      throw new HttpException('User is not exists', HttpStatus.BAD_REQUEST);
    }
    return await this.articlesRepository.find({
      where: {
        user: {
          email: userEmail,
        },
      },
    });
  }

  async getArticles(filterForm: GetArticleFilterDto): Promise<ArticleEntity[]> {
    const page = filterForm.page > 0 ? filterForm.page - 1 : 0;
    const pagesize =
      filterForm.pagesize > 0 && filterForm.pagesize % 10 === 0
        ? filterForm.pagesize
        : 10;
    const startDate =
      filterForm.startDate &&
      filterForm.finishDate &&
      filterForm.startDate < filterForm.finishDate
        ? filterForm.startDate
        : new Date(new Date().toDateString());
    const finishDate =
      filterForm.finishDate &&
      filterForm.startDate &&
      filterForm.finishDate > filterForm.startDate
        ? filterForm.finishDate
        : new Date();
    return await this.articlesRepository.find({
      where: [
        { creationDate: Between(startDate, finishDate) },
        {
          user: {
            email: ILike(`%${filterForm.authorEmail}%`),
          },
        },
      ],
      take: pagesize,
      skip: page * pagesize,
    });
  }
}
