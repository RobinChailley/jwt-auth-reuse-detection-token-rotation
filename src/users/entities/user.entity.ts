import { AbstractEntity } from '@shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  hashPassword: string;

  @Column({ type: 'varchar' })
  salt: string;
}
