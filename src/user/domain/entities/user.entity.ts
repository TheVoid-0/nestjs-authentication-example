import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: '255' })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: '255', unique: true })
  email: string;

  @Column({ name: 'mobile_phone', type: 'varchar', length: '25' })
  mobilePhone: string;

  @Column({ name: 'password', type: 'varchar', length: '255' })
  password: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: 'now()' })
  updatedAt: Date;
}
