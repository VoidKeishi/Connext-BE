import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('User')
  export class User {
    @PrimaryGeneratedColumn() public userId: number;
  
    @Column({ length: 50, unique: true }) public userName: string;
  
    @Column({ nullable: false }) public passwordHashed: string;
  
    @Column({ length: 100, unique: true }) public email: string;
  
    @Column({ length: 50, nullable: true }) public nickName?: string;
  
    @Column({ nullable: true }) public avatarUrl?: string;
  
    @Column({ type: 'date', nullable: true }) public dateOfBirth?: Date;
  
    @CreateDateColumn({ name: 'created_at' }) public createdAt: Date;
  
    @UpdateDateColumn({ name: 'last_login', nullable: true })
    public lastLogin?: Date;
  
    @Column({ default: false, name: 'is_online' }) public isOnline: boolean;
  
    @Column({ name: 'last_active_at', nullable: true })
    public lastActiveAt?: Date;
  }
  