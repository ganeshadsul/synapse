import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { SeederConfigService } from '../seeder-config/seeder-config.service';
import RolesData from './data/roles.json';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly seederConfigService: SeederConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    const tableName = this.roleRepo.metadata.tableName;

    this.logger.log(`Checking seeder config for table: ${tableName}`);

    if (await this.seederConfigService.shouldSeed(tableName)) {
      // cleared the old entries
      await this.roleRepo.clear();

      await this.roleRepo.save(RolesData);

      await this.seederConfigService.setSeeded(tableName);
    }
  }
}
