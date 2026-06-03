import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController as V1RoleController } from './v1/role.controller';
import { PermissionCacheService } from '../auth/permission-cache-service/permission-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService, PermissionCacheService],
  controllers: [V1RoleController],
  exports: [RoleService],
})
export class RoleModule {}
