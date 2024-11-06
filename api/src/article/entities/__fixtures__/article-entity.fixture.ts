import { mockUserEntity } from 'src/user/entities/__fixtures__/user-entity.fixture';
import { ArticleEntity } from '../article.entity';

export const mockArticleEntity: ArticleEntity = {
  id: 0,
  title: 'Test ARTICLE',
  description: 'This is test article solving problem',
  creationDate: new Date(),
  user: mockUserEntity,
};
