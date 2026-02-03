import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsActiveStatus } from '../../../common/enums/is-active-status.enum';

@Entity('seeder_config')
export class SeederConfig extends BaseEntity {
  @Column({ unique: true })
  table: string;

  @Column({
    default: IsActiveStatus.INACTIVE,
    comment: `INACTIVE = 0, ACTIVE = 1, ARCHIVED = 2, PENDING = 3, DONE = 4, BANNED = 5`,
  })
  isActive: number = IsActiveStatus.INACTIVE;
}
