import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ schema: 'public', name: 'account_confirmation' })
export class AccountConfirmationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'code', type: 'varchar', length: '6' })
  code: string;

  @Column({ name: 'is_valid', type: 'boolean', default: true })
  isValid: boolean;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity;

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}
