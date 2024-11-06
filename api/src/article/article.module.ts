import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './services/article/article.service';
import { JwtService } from 'src/user/services/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/user/services/auth/strategies/jwt/jwt.strategy';
import { AppCacheModule } from '../app-cache/app-cache.module';
import { ArticleEntity } from './entities/article.entity';
import { ArticleController } from './article.controller';
import { UserService } from 'src/user/services/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { PasswordService } from 'src/user/services/password/password.service';
import { AuthService } from 'src/user/services/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    AuthService,
    UserService,
    PasswordService,
    JwtService,
    JwtStrategy,
  ],
})
export class ArticleModule {}
