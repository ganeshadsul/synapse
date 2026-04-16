import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      this.logger.log('✅ Postgres Connection Successful.');
      const db = this.dataSource.options.database as string;
      this.logger.log(`📦 Database connected: ${db}`);
    } else {
      this.logger.log(`❌ Postgres Connection Failed.`);
    }
  }
}
