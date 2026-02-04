import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SeederConfigService } from '../seeder-config/seeder-config.service';
import CategoriesData from './data/categories.json';

@Injectable()
export class CatagoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly seederConfigService: SeederConfigService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    const tableName = this.categoryRepo.metadata.tableName;

    if (
      (await this.seederConfigService.shouldSeed(tableName)) &&
      this.configService.get<string>('NODE_ENV') !== 'production'
    ) {
      // clearing the old entries
      await this.categoryRepo.clear();

      await this.categoryRepo.save(CategoriesData);

      await this.seederConfigService.setSeeded(tableName);
    }
  }
}
