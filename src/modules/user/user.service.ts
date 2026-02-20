import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
import adminUserData from './data/admin-user.data.json';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRoleMapping)
    private readonly userRoleMappingRepo: Repository<UserRoleMapping>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    // const admin = await this.userRepo.'
    const adminUser = adminUserData;

    const role = await this.roleRepo.findOneBy({ code: 'admin' });
    this.logger.log(role);
    if (role) adminUser.userRoleMappings[0].role.id = role.id;

    const admin = this.userRepo.create(adminUser);

    this.logger.log(adminUser);
  }
}
