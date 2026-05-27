import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController as V1RoleController } from './v1/role.controller';
import { Permission } from './entities/permission.entity';
import { PermissionCacheService } from './permission-cache-service/permission-cache.service';
import { RolePermissionMapping } from './entities/role-permission-mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermissionMapping]),
  ],
  providers: [RoleService, PermissionCacheService],
  controllers: [V1RoleController],
  exports: [RoleService, PermissionCacheService],
})
export class RoleModule {}
