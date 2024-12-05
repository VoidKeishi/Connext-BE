import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupChat } from './group-chat.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('GroupMember')
export class GroupMember {
  @PrimaryGeneratedColumn()
  group_member_id: number;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.groupMembers)
  @JoinColumn({ name: 'group_id' })
  group_id: number;

  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column()
  role: string;

  @CreateDateColumn()
  joined_at: Date;
}
