import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRoleMapping } from '../../user/entities/user-role-mapping.entity';
import { User } from '../../user/entities/user.entity';
import { RolePermissionMapping } from './role-permission-mapping.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ length: 50, unique: true })
  name!: string;

  @Column({ length: 50, unique: true })
  code!: string;

  @Column()
  level!: number;

  @Column()
  description!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy!: User;

  @OneToMany(() => UserRoleMapping, (userRoleMapping) => userRoleMapping.role, {
    cascade: true,
  })
  userRoleMappings!: UserRoleMapping[];

  @OneToMany(() => RolePermissionMapping, (mapping) => mapping.role, {
    cascade: true,
  })
  permissionMappings!: RolePermissionMapping[];

  @BeforeInsert()
  @BeforeUpdate()
  generateCode() {
    if (this.name) {
      this.code = this.name.trim().toLowerCase().replaceAll(/\s+/g, '-');
    }
  }
}
