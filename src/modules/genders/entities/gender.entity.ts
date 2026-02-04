import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('genders')
export class Gender extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 5, unique: true })
  shortName: string;

  //   @ManyToMany('User', { nullable: true })
  //   createdBy: string;

  //   @ManyToMany('User', { nullable: true })
  //   updatedBy: string;
}
