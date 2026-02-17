import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('genders')
export class Gender extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 5, unique: true })
  shortName: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @BeforeInsert()
  @BeforeUpdate()
  generateCode() {
    if (this.name) {
      this.code = this.name.trim().toLowerCase().replaceAll(/\s+/g, '-');
    }
  }
}
