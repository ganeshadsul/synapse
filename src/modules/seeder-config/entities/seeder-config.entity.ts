import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsActiveStatus } from '../../../common/enums/is-active-status.enum';

@Entity('seeder_config')
export class SeederConfig extends BaseEntity {
  @Column({ unique: true })
  table: string;

  @Column({ default: IsActiveStatus.INACTIVE })
  isActive: number = IsActiveStatus.INACTIVE;
}
