import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetArticleFilterDto } from './dto/get-article-filter.dto';
import { ArticleService } from './services/article/article.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() article: CreateArticleDto) {
    const newArticle = await this.articleService.createArticle(article);

    return {
      message: 'Creating article successful',
      article: {
        id: newArticle.id,
        title: newArticle.title,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':email/:id')
  async update(
    @Param('id') id: number,
    @Param('email') userEmail: string,
    @Body() updateForm: UpdateArticleDto,
  ) {
    const updateData = await this.articleService.updateArticle(
      id,
      userEmail,
      updateForm,
    );

    return {
      message: 'Updating article successful',
      updateData,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':email/:id')
  async delete(@Param('id') id: number, @Param('email') userEmail: string) {
    const reqData = await this.articleService.deleteArticle(id, userEmail);

    return {
      message: 'Deleting article successful',
      reqData,
    };
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':userEmail')
  async getUserArticles(@Param('userEmail') userEmail: string) {
    const userArticleList =
      await this.articleService.getUserArticles(userEmail);

    return {
      message: 'Getting user articles successful',
      userArticleList,
    };
  }

  @UseInterceptors(CacheInterceptor)
  @Get('')
  async getArticles(@Query() filterForm: GetArticleFilterDto) {
    const articleList = await this.articleService.getArticles(filterForm);

    return {
      message: 'Getting articles successful',
      articleList,
    };
  }
}
