import { Logger, Module } from '@nestjs/common';
import { CatagoriesService } from './catagory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CatagoriesService, Logger],
})
export class CategoryModule {}
