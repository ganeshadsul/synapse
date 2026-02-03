import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsActiveStatus } from '../enums/is-active-status.enum';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: IsActiveStatus.ACTIVE,
    comment: `INACTIVE = 0, ACTIVE = 1, ARCHIVED = 2, PENDING = 3, DONE = 4, BANNED = 5`,
  })
  isActive: number;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updatedAt: Date;
}
