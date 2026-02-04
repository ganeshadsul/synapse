import { Logger, Module } from '@nestjs/common';
import { CatagoryService } from './catagory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CatagoryService, Logger],
})
export class CategoryModule {}
