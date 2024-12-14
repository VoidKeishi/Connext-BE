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
import { MEDIA_TYPE } from 'src/common/enum/media-type.enum';

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

  @Column({ enum: MEDIA_TYPE, default: MEDIA_TYPE.TEXT })
  media_type: MEDIA_TYPE;

  @CreateDateColumn()
  timestamp: Date;
}
