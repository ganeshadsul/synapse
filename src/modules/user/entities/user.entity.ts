import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Gender } from '../../gender/entities/gender.entity';
import { UserRoleMapping } from './user-role-mapping.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'bigint', unique: true, nullable: true, default: null })
  phone!: number | null;

  @Column({ unique: true, nullable: true, default: null })
  email!: string;

  @ManyToOne(() => Gender, { nullable: true })
  @JoinColumn({ name: 'genderId' })
  gender!: Gender;

  @Column()
  @Exclude()
  password!: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt!: Date;

  @Column({ type: 'boolean', default: false })
  isBlacklisted!: boolean;

  // Foreign Keys
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'blackListedById' })
  blacklistedBy!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deletedById' })
  deletedBy!: User;

  // Relations
  @OneToMany(() => UserRoleMapping, (userRoleMapping) => userRoleMapping.user, {
    cascade: true,
  })
  userRoleMappings!: UserRoleMapping[];

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (
      this.password &&
      !(this.password.startsWith('$2b$') || this.password.startsWith('$2a$'))
    ) {
      const saltRound = 10;
      this.password = await bcrypt.hash(this.password, saltRound);
    }
  }
}
