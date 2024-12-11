import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupMember } from './group-member.entity';

@Entity('GroupChat')
export class GroupChat {
  @PrimaryGeneratedColumn()
  group_id: number;

  @Column({ nullable: true })
  group_name: string;

  @Column({ nullable: true })
  last_message: string;

  @Column('date', { nullable: true })
  last_message_sent_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.groups)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @OneToMany(() => GroupMember, (groupChat) => groupChat.group_id)
  groupMembers: GroupMember[];
}
