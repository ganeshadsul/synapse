import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('user_role_mappings')
export class UserRoleMapping extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role!: Role;
}
