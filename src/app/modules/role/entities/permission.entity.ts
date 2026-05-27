import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RolePermissionMapping } from './role-permission-mapping.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ unique: true })
  action!: string;

  @Column({ nullable: true })
  description!: string;

  @OneToMany(() => RolePermissionMapping, (mapping) => mapping.permission)
  roleMappings!: RolePermissionMapping[];
}
