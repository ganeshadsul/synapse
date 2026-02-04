import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';
import { Repository } from 'typeorm';
import { SeederConfigService } from '../seeder-config/seeder-config.service';
import gendersData from './data/genders.json';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepo: Repository<Gender>,
    private readonly seederConfigService: SeederConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    const tableName = this.genderRepo.metadata.tableName;

    this.logger.log(`Checking seeder config for table: ${tableName}`);
    if (await this.seederConfigService.shouldSeed(tableName)) {
      // cleared the old entries
      await this.genderRepo.clear();

      // inserting new entries
      await this.genderRepo.insert(gendersData);

      // Mard isSeeded as true as data is inserted successfully
      await this.seederConfigService.setSeeded(tableName);
    }
  }
}
