import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeederConfig } from './entities/seeder-config.entity';
import { Repository } from 'typeorm';
import { IsActiveStatus } from '../../common/enums/is-active-status.enum';

@Injectable()
export class SeederConfigService {
  constructor(
    @InjectRepository(SeederConfig)
    private readonly seederRepo: Repository<SeederConfig>,
    private readonly logger: Logger,
  ) {}

  async shouldSeed(tableName: string): Promise<boolean> {
    const config = await this.seederRepo.findOneBy({ table: tableName });

    if (!config) {
      this.logger.log(
        `No config found. Seeder Config created for table: ${tableName}`,
      );

      await this.seederRepo.save({ table: tableName });
      return true;
    }

    this.logger.log(`Configuration found. isActive: ${config.isActive}`);
    return config.isActive === 0;
  }

  async setSeeded(tableName: string) {
    const config = await this.seederRepo.findOneBy({ table: tableName });
    if (!config) {
      this.logger.log(`No config found for table: ${tableName}`);
      return;
    }

    config.isActive = IsActiveStatus.DONE;
    await this.seederRepo.save(config);
    this.logger.log(`Table ${tableName} seeding completed.`);
  }
}
