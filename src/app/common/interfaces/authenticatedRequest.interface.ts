import { UserRoleMapping } from '../../modules/user/entities/user-role-mapping.entity';

export interface AuthenticatedRequest {
  user?: {
    userRoleMappings?: UserRoleMapping[];
  };
}
