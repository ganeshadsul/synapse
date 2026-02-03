import { Logger, Module } from '@nestjs/common';
import { GendersService } from './genders.service';
import { GendersController as V1GendersController } from './v1/genders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './entities/gender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  providers: [GendersService, Logger],
  controllers: [V1GendersController],
})
export class GendersModule {}
