import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column()
  level: number;

  @Column()
  description: string;

  // @ManyToMany('User', { nullable: true })
  // createdBy: string;

  // @ManyToMany('User', { nullable: true })
  // updatedBy: string;
}
