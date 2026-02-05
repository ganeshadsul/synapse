import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('post_categories')
export class PostCategory extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;

  // @ManyToMany('User', { nullable: true })
  // createdBy: string;

  // @ManyToMany('User', { nullable: true })
  // updatedBy: string;
}
