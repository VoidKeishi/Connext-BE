import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('GroupMessage')
export class GroupMessage {
  @PrimaryGeneratedColumn()
  group_id: number;

  @PrimaryGeneratedColumn()
  message_id: number;

  @ManyToOne(() => User, (user) => user.groupMessages)
  @JoinColumn({ name: 'sender_id' })
  sender_id: User;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  media_url: string | null;

  @Column()
  media_type: string;

  @CreateDateColumn()
  timestamp: Date;
}
