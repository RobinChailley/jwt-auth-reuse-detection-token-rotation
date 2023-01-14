import { RefreshTokenEntity } from '@refresh-tokens/entities/refresh-token.entity';
import { AbstractEntity } from '@shared/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  hashPassword: string;

  @Column({ type: 'varchar' })
  salt: string;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];
}
