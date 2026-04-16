import { Module } from '@nestjs/common';
import { GenderModule } from '../gender/gender.module';
import { RoleModule } from '../role/role.module';
import { PostCategoryModule } from '../post-category/post-category.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    GenderModule,
    RoleModule,
    PostCategoryModule,
    RouterModule.register([
      {
        path: 'system',
        children: [GenderModule, RoleModule, PostCategoryModule],
      },
    ]),
  ],
})
export class SystemModule {}
