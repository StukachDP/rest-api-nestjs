import { UserEntity } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({
  name: 'articles',
})
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
  })
  title: string;

  @Column({
    name: 'description',
  })
  description: string;

  @Column({
    name: 'creation_date',
  })
  creationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  user: UserEntity;
}
