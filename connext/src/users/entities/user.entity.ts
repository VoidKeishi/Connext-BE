import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn({ name: 'user_id' }) public userId: number;

  @Field()
  @Column({ name: 'username', length: 50, unique: true }) public userName: string;

  @Column({ name: 'password_hash', nullable: false }) public passwordHashed: string;

  @Field()
  @Column({ name: 'email', length: 100, unique: true }) public email: string;

  @Field()
  @Column({ name: 'nickname', length: 50, nullable: true }) public nickName?: string;

  @Field()
  @Column({ name: 'avatar_url', nullable: true }) public avatarUrl?: string;

  @Field()
  @Column({ name: 'date_of_birth', type: 'date', nullable: true }) public dateOfBirth?: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' }) public createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'last_login', nullable: true }) public lastLogin?: Date;

  @Field()
  @Column({ default: false, name: 'is_online' }) public isOnline: boolean;

  @Field()
  @Column({ name: 'last_active_at', nullable: true }) public lastActiveAt?: Date;
}
