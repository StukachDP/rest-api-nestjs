import { mockArticleEntity } from 'src/article/entities/__fixtures__/article-entity.fixture';
import { UserEntity } from '../user.entity';

export const mockUserEntity: UserEntity = {
  id: 0,
  email: 'email',
  lastName: 'lName',
  firstName: 'fName',
  token: 'token',
  passwordHash: 'password',
  articles: [mockArticleEntity],
};
