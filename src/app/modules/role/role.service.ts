import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { SeederConfigService } from '../seeder-config/seeder-config.service';
import RolesData from './data/roles.json';
import { CreateRoleDto, PatchRoleDto, ReplaceRoleDto } from './dto/role.dto';
import { IsActiveStatus } from '../../common/enums/is-active-status.enum';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly seederConfigService: SeederConfigService,
  ) {}

  async onModuleInit() {
    const tableName = this.roleRepo.metadata.tableName;

    this.logger.log(`Checking seeder config for table: ${tableName}`);

    if (await this.seederConfigService.shouldSeed(tableName)) {
      // cleared the old entries
      for (const role of RolesData) {
        const exists = await this.roleRepo.findOne({
          where: { name: role.name },
        });

        if (!exists) {
          const newRole = this.roleRepo.create(role);
          await this.roleRepo.save(newRole);
          this.logger.log(`Seeded missing role: ${role.name}`);
        }
      }

      await this.seederConfigService.setSeeded(tableName);
    }
  }

  async getAll() {
    const roles = await this.roleRepo.find();

    return { roles };
  }

  async createOne(createRoleDto: CreateRoleDto) {
    const roleObj = this.roleRepo.create(createRoleDto);
    const role = await this.roleRepo.save(roleObj);
    return { role };
  }

  async getOne(id: string) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not foud.');

    return { role };
  }

  async patchOne(id: string, patchRoleDto: PatchRoleDto) {
    const oldRole = await this.roleRepo.findOneBy({ id });
    if (!oldRole) throw new NotFoundException('Role not found.');

    Object.assign(oldRole, patchRoleDto);

    const role = this.roleRepo.create(oldRole);
    const updatedRole = await this.roleRepo.save(role);
    return { role: updatedRole };
  }

  async updateOne(id: string, replaceRoleDto: ReplaceRoleDto) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new NotFoundException('Role not found.');

    Object.assign(role, replaceRoleDto);

    const roleObj = this.roleRepo.create(role);

    const updatedRole = await this.roleRepo.save(roleObj);
    return { role: updatedRole };
  }

  async deleteOne(id: string) {
    await this.roleRepo.findOneByOrFail({ id });

    return await this.roleRepo.softDelete(id);
  }

  async restoreOne(id: string) {
    const result = await this.roleRepo.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gender with ID ${id} not found`);
    }
    const role = await this.roleRepo.findOneBy({ id });
    return { role };
  }

  async deActivateOne(id: string) {
    const role = await this.roleRepo.findOneByOrFail({ id });
    role.isActive = IsActiveStatus.INACTIVE;

    await this.roleRepo.save(role);

    return { role };
  }

  async activateOne(id: string) {
    const role = await this.roleRepo.findOneByOrFail({ id });
    role.isActive = IsActiveStatus.ACTIVE;

    await this.roleRepo.save(role);

    return { role };
  }
}
