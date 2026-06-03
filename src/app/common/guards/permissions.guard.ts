import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionCacheService } from '../../modules/auth/permission-cache-service/permission-cache.service';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { UserRoleMapping } from '../../modules/user/entities/user-role-mapping.entity';
import { AuthenticatedRequest } from '../interfaces/authenticatedRequest.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionCacheService: PermissionCacheService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Extract the required permissions attached to the route handler or controller
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If the route doesn't have the @RequirePermissions decorator, let everyone through
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 2. Grab the user from the request (populated by your JwtAuthGuard)
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Explicitly typing the user object to avoid 'any'
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication context missing.');
    }

    // 3. Extract the role names from the user's mapping array
    if (!user.userRoleMappings || user.userRoleMappings.length === 0) {
      throw new ForbiddenException(
        'Access denied. No roles assigned to this user.',
      );
    }

    const userRoleMappings: UserRoleMapping[] = user.userRoleMappings;

    // Removing 'any' and using a type predicate (name is string)
    // to guarantee the output is strictly a string[] array.
    const userRoles: string[] = userRoleMappings
      .map((mapping: UserRoleMapping) => mapping.role?.name)
      .filter((name): name is string => name !== undefined && name !== null);

    // 4. Aggregating all permissions from all roles using our fast RAM cache
    const userPermissions = new Set<string>();

    userRoles.forEach((roleName: string) => {
      const permissions =
        this.permissionCacheService.getAllowedActions(roleName);
      permissions.forEach((permission: string) =>
        userPermissions.add(permission),
      );
    });

    // 5. The Ultimate Verification: Does the user possess EVERY required permission?
    const hasAllPermissions = requiredPermissions.every((permission: string) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Access denied. Insufficient permissions to execute this action.',
      );
    }

    return true;
  }
}
