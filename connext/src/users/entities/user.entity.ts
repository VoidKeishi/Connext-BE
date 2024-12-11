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
  public userId: number;

  @Column({ name: 'username', length: 50, unique: true })
  public userName: string;

  @Column({ name: 'password_hash', nullable: false })
  public passwordHashed: string;

  @Column({ name: 'email', length: 100, unique: true })
  public email: string;

  @Column({ name: 'nickname', length: 50, nullable: true })
  public nickName?: string;

  @Column({ name: 'avatar_url', nullable: true })
  public avatarUrl?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  public dateOfBirth?: Date;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'last_login', nullable: true })
  public lastLogin?: Date;

  @Column({ default: false, name: 'is_online' })
  public isOnline: boolean;

  @Column({ name: 'last_active_at', nullable: true })
  public lastActiveAt?: Date;

  @OneToMany(() => Conversation, (conversation) => conversation.sender_id)
  senders: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.recipient_id)
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
