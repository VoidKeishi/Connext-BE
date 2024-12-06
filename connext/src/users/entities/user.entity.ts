import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' }) public userId: number;

  @Column({ name: 'username', length: 50, unique: true }) public userName: string;

  @Column({ name: 'password_hash', nullable: false }) public passwordHashed: string;

  @Column({ name: 'email', length: 100, unique: true }) public email: string;

  @Column({ name: 'nickname', length: 50, nullable: true }) public nickName?: string;

  @Column({ name: 'avatar_url', nullable: true }) public avatarUrl?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true }) public dateOfBirth?: Date;

  @CreateDateColumn({ name: 'created_at' }) public createdAt: Date;

  @UpdateDateColumn({ name: 'last_login', nullable: true }) public lastLogin?: Date;

  @Column({ default: false, name: 'is_online' }) public isOnline: boolean;

  @Column({ name: 'last_active_at', nullable: true }) public lastActiveAt?: Date;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';
}