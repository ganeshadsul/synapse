import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleMapping } from './entities/user-role-mapping.entity';
// import adminUserData from './data/admin-user.data.json';
import { Role } from '../role/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/user.dto';
import { IsActiveStatus } from '../../common/enums/is-active-status.enum';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserRoleMapping)
    private readonly userRoleMappingRepo: Repository<UserRoleMapping>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  // Seeding admin User
  async onModuleInit() {
    const activeAdminUser = await this.userRepo.findOne({
      where: {
        isActive: IsActiveStatus.ACTIVE,
        userRoleMappings: {
          role: {
            code: 'admin',
            isActive: IsActiveStatus.ACTIVE,
          },
        },
      },
    });

    if (activeAdminUser) {
      this.logger.log(
        `Admin user exists email: ${activeAdminUser.email}. Skipping Admin Seed.`,
      );
      return;
    }

    const role = await this.roleRepo.findOneBy({ code: 'admin' });
    this.logger.log(`role: ${JSON.stringify(role)}`);
    if (!role) {
      this.logger.log('Admin role not found.');
      return;
    }

    const adminData: CreateUserDto = {
      firstName: this.configService.get<string>('ADMIN_FIRST_NAME') || 'System',
      lastName: this.configService.get<string>('ADMIN_LAST_NAME') || 'Admin',
      phone: this.configService.get<number>('ADMIN_PHONE') || null,
      email: this.configService.get<string>('ADMIN_EMAIL') || 'admin@gmail.com',
      password:
        this.configService.get<string>('ADMIN_PASSWORD') || 'Admin@1234',
      roleIds: [role.id],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...admin } = await this.create(adminData);
    this.logger.log(`Admin created. Admin: ${JSON.stringify(admin)}`);
  }

  // create new user
  async create(createuserDto: CreateUserDto): Promise<User> {
    const { roleIds, ...userData } = createuserDto;

    const user = this.userRepo.create(userData);

    if (roleIds && roleIds.length > 0) {
      user.userRoleMappings = roleIds.map((id: string) => {
        const role = new Role();
        role.id = id;

        const mapping = new UserRoleMapping();
        mapping.role = role;

        return mapping;
      });
    }

    return await this.userRepo.save(user);
  }
}
