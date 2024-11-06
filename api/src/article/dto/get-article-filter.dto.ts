import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetArticleFilterDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  page: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  pagesize: number;

  @IsString()
  @IsOptional()
  authorEmail?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  finishDate?: Date;
}
