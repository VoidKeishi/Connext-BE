import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupChat } from './group-chat.entity';

@Entity('GroupMessage')
export class GroupMessage {
  @PrimaryColumn({ type: 'int64' })
  @ManyToOne(() => GroupChat, (groupChat) => groupChat.groupMessages)
  @JoinColumn({ name: 'group_id' })
  group_id: GroupChat;

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
