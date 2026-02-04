import { Logger, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController } from './v1/roles.controller';
//
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, Logger],
  controllers: [RolesController],
})
export class RolesModule {}
