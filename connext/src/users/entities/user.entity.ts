import { Role } from 'src/common/enum/role-enum';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Friendship } from 'src/friends/entities/friendship.entity';
import { GroupChat } from 'src/group-chat/entities/group-chat.entity';
import { GroupMember } from 'src/group-chat/entities/group-member.entity';
import { GroupMessage } from 'src/group-chat/entities/group-message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ name: 'username', length: 50, unique: true })
  username: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHashed: string;

  @Column({ name: 'email', length: 100, unique: true })
  email: string;

  @Column({ name: 'nickname', length: 50, nullable: true })
  nickName?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @Column({ default: false, name: 'is_online' })
  isOnline: boolean;

  @Column({ name: 'last_active_at', nullable: true })
  lastActiveAt?: Date;

  @Column({ name: 'role', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(
    () => Conversation,
    (conversation) => conversation.first_participant_id,
  )
  senders: Conversation[];

  @OneToMany(
    () => Conversation,
    (conversation) => conversation.second_participant_id,
  )
  recipients: Conversation[];

  @OneToMany(() => Friendship, (friendship) => friendship.user_id)
  users: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.friend_user_id)
  friends: Friendship[];

  @OneToMany(() => GroupChat, (groupchat) => groupchat.created_by)
  groups: GroupChat[];

  @OneToMany(() => GroupMessage, (groupMessage) => groupMessage.sender_id)
  groupMessages: GroupMessage[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user_id)
  groupMembers: GroupMember[];
}
