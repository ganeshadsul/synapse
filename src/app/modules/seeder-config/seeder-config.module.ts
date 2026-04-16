import { Global, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederConfig } from './entities/seeder-config.entity';
import { SeederConfigService } from './seeder-config.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SeederConfig])],
  exports: [SeederConfigService],
  providers: [SeederConfigService, Logger],
})
export class SeederConfigModule {}
