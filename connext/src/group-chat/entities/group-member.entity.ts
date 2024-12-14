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
import { GroupMemberRole } from 'src/common/enum/group-member-role.enum';

@Entity('GroupMember')
export class GroupMember {
  @PrimaryGeneratedColumn()
  group_member_id: number;

  @ManyToOne(() => GroupChat, (groupChat) => groupChat.groupMembers)
  @JoinColumn({ name: 'group_id' })
  group_id: GroupChat;

  @ManyToOne(() => User, (user) => user.groupMembers)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column({ enum: GroupMemberRole, default: GroupMemberRole.MEMBER })
  role: GroupMemberRole;

  @CreateDateColumn()
  joined_at: Date;
}
