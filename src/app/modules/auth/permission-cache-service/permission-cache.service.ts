import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../role/entities/role.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PermissionCacheService implements OnModuleInit {
  private readonly logger = new Logger(PermissionCacheService.name);

  private cache: Record<string, string[]> = {};

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.refreshCache();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.log('🔄 Background Task: Syncing Permissions from DB...');
    await this.refreshCache();
  }

  async refreshCache() {
    try {
      const roles = await this.roleRepository.find({
        relations: {
          permissionMappings: {
            permission: true,
          },
        },
      });
      const newCache: Record<string, string[]> = {};

      roles.forEach((role) => {
        const actions = role.permissionMappings
          ? role.permissionMappings.map((mapping) => mapping.permission.action)
          : [];

        newCache[role.name] = actions;
      });

      this.cache = newCache;
      this.logger.log(
        '✅ RAM Cache successfully updated with latest permissions.',
      );
      this.logger.log(`Permissions: ${JSON.stringify(this.cache)}`);
    } catch (error) {
      this.logger.error('❌ Failed to refresh permission cache', error);
    }
  }

  getAllowedActions(roleName: string): string[] {
    return this.cache[roleName] || [];
  }
}
