import { Logger, Module } from '@nestjs/common';
import { PostCategoryService } from './post-catagory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/post-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  providers: [PostCategoryService, Logger],
})
export class PostCategoryModule {}
