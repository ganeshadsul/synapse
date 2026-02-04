import { Logger, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController as V1RolesController } from './v1/roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService, Logger],
  controllers: [V1RolesController],
})
export class RoleModule {}
