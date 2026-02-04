import { Logger, Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController as V1GenderController } from './v1/gender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  providers: [GenderService, Logger],
  controllers: [V1GenderController],
})
export class GenderModule {}
