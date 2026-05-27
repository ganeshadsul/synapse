import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { User } from '../../user/entities/user.entity';

@Entity('role_permission_mappings')
export class RolePermissionMapping extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.permissionMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.roleMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission!: Permission;

  // Inherited from BaseEntity, but you could explicitly link the audit trails:
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy!: User;
}
