import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRoleMapping } from './entities/user-role-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRoleMapping])],
})
export class UserModule {}
