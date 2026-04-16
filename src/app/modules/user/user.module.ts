import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
import { UserService } from './user.service';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRoleMapping, Role])],
  providers: [UserService],
})
export class UserModule {}
